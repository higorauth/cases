from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class Message(BaseModel):
    role: str
    content: str
    timestamp: Optional[datetime] = None

class ChatRequest(BaseModel):
    conversation_id: str
    user_id: str
    message: str
    settings: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    conversation_id: str
    message: str
    role: str = "assistant"
    metadata: Optional[Dict[str, Any]] = None

class AISettings(BaseModel):
    system_prompt: str
    model: str = "gpt-4.1-mini"
    temperature: float = 0.7
    max_tokens: int = 2000
    language: str = "pt-BR"
    context_window: int = 10
