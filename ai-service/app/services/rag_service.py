from supabase import create_client, Client
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class RAGService:
    def __init__(self, supabase_url: str, supabase_key: str):
        self.supabase: Client = create_client(supabase_url, supabase_key)
    
    async def search_knowledge_base(
        self,
        query_embedding: List[float],
        match_threshold: float = 0.7,
        match_count: int = 5
    ) -> List[Dict[str, Any]]:
        try:
            result = self.supabase.rpc(
                'match_documents',
                {
                    'query_embedding': query_embedding,
                    'match_threshold': match_threshold,
                    'match_count': match_count
                }
            ).execute()
            
            if not result.data:
                return []
            
            return result.data
        except Exception as e:
            logger.error(f"Erro na busca vetorial: {str(e)}")
            return []
    
    async def get_context_from_knowledge_base(
        self,
        query: str,
        openai_service,
        max_context_length: int = 3000
    ) -> str:
        try:
            query_embedding = await openai_service.generate_embedding(query)
            similar_docs = await self.search_knowledge_base(query_embedding)
            
            if not similar_docs:
                return ""
            
            context_parts = []
            current_length = 0
            
            for doc in similar_docs:
                content = doc.get('content', '')
                if current_length + len(content) > max_context_length:
                    break
                context_parts.append(f"---\n{doc.get('title', 'Sem título')}\n{content}")
                current_length += len(content)
            
            return "\n\n".join(context_parts)
        except Exception as e:
            logger.error(f"Erro ao obter contexto: {str(e)}")
            return ""
