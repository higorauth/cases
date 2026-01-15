from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import ChatRequest, ChatResponse
from app.services.openai_service import OpenAIService
from app.services.rag_service import RAGService
from app.services.memory_service import MemoryService
from app.config import get_settings
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/chat", tags=["chat"])

memory_service = None

async def get_memory_service():
    global memory_service
    if memory_service is None:
        settings = get_settings()
        memory_service = MemoryService(
            redis_host=settings.REDIS_HOST,
            redis_port=settings.REDIS_PORT,
            redis_db=settings.REDIS_DB
        )
        await memory_service.connect()
    return memory_service

async def get_openai_service(api_key: str = None):
    settings = get_settings()
    return OpenAIService(api_key=api_key or settings.OPENAI_API_KEY)

async def get_rag_service():
    settings = get_settings()
    return RAGService(
        supabase_url=settings.SUPABASE_URL,
        supabase_key=settings.SUPABASE_KEY
    )

@router.post("/message", response_model=ChatResponse)
async def process_message(
    request: ChatRequest,
    memory: MemoryService = Depends(get_memory_service)
):
    try:
        settings = request.settings or {}
        system_prompt = settings.get("system_prompt", "Você é um assistente útil e profissional.")
        model = settings.get("model", "gpt-4.1-mini")
        temperature = settings.get("temperature", 0.7)
        max_tokens = settings.get("max_tokens", 2000)
        context_window = settings.get("context_window", 10)
        openai_key = settings.get("openai_api_key")
        
        openai = await get_openai_service(api_key=openai_key)
        rag = await get_rag_service()
        
        await memory.add_message(
            conversation_id=request.conversation_id,
            role="user",
            content=request.message,
            context_window=context_window
        )
        
        history = await memory.get_conversation_history(request.conversation_id)
        
        knowledge_context = await rag.get_context_from_knowledge_base(
            query=request.message,
            openai_service=openai
        )
        
        messages = [
            {"role": "system", "content": system_prompt}
        ]
        
        if knowledge_context:
            messages.append({
                "role": "system",
                "content": f"Contexto da base de conhecimento:\n\n{knowledge_context}"
            })
        
        messages.extend(history)
        
        response_content = await openai.generate_response(
            messages=messages,
            model=model,
            temperature=temperature,
            max_tokens=max_tokens
        )
        
        await memory.add_message(
            conversation_id=request.conversation_id,
            role="assistant",
            content=response_content,
            context_window=context_window
        )
        
        return ChatResponse(
            conversation_id=request.conversation_id,
            message=response_content,
            role="assistant",
            metadata={
                "model": model,
                "context_used": bool(knowledge_context)
            }
        )
    except Exception as e:
        logger.error(f"Erro ao processar mensagem: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/conversation/{conversation_id}")
async def clear_conversation(
    conversation_id: str,
    memory: MemoryService = Depends(get_memory_service)
):
    try:
        await memory.clear_conversation(conversation_id)
        return {"message": "Conversa limpa com sucesso"}
    except Exception as e:
        logger.error(f"Erro ao limpar conversa: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
