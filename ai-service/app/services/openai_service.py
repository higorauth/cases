from openai import OpenAI
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class OpenAIService:
    def __init__(self, api_key: str):
        self.client = OpenAI(api_key=api_key)
    
    async def generate_response(
        self,
        messages: List[Dict[str, str]],
        model: str = "gpt-4.1-mini",
        temperature: float = 0.7,
        max_tokens: int = 2000
    ) -> str:
        try:
            response = self.client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Erro ao gerar resposta OpenAI: {str(e)}")
            raise
    
    async def generate_embedding(self, text: str) -> List[float]:
        try:
            response = self.client.embeddings.create(
                model="text-embedding-ada-002",
                input=text
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"Erro ao gerar embedding: {str(e)}")
            raise
