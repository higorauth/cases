import redis.asyncio as redis
import json
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class MemoryService:
    def __init__(self, redis_host: str, redis_port: int, redis_db: int = 0):
        self.redis_client = None
        self.redis_host = redis_host
        self.redis_port = redis_port
        self.redis_db = redis_db
    
    async def connect(self):
        self.redis_client = await redis.Redis(
            host=self.redis_host,
            port=self.redis_port,
            db=self.redis_db,
            decode_responses=True
        )
    
    async def close(self):
        if self.redis_client:
            await self.redis_client.close()
    
    def _get_key(self, conversation_id: str) -> str:
        return f"conversation:{conversation_id}:messages"
    
    async def add_message(
        self,
        conversation_id: str,
        role: str,
        content: str,
        context_window: int = 10
    ):
        try:
            key = self._get_key(conversation_id)
            message = json.dumps({"role": role, "content": content})
            await self.redis_client.rpush(key, message)
            await self.redis_client.ltrim(key, -context_window, -1)
            await self.redis_client.expire(key, 86400)
        except Exception as e:
            logger.error(f"Erro ao adicionar mensagem: {str(e)}")
    
    async def get_conversation_history(
        self,
        conversation_id: str
    ) -> List[Dict[str, str]]:
        try:
            key = self._get_key(conversation_id)
            messages = await self.redis_client.lrange(key, 0, -1)
            return [json.loads(msg) for msg in messages]
        except Exception as e:
            logger.error(f"Erro ao recuperar histórico: {str(e)}")
            return []
    
    async def clear_conversation(self, conversation_id: str):
        try:
            key = self._get_key(conversation_id)
            await self.redis_client.delete(key)
        except Exception as e:
            logger.error(f"Erro ao limpar conversa: {str(e)}")
