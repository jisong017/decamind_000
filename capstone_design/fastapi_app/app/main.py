from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import UJSONResponse
from pydantic import BaseModel
from typing import Dict, Union
import os

from db_query import save_chat, get_chats
from open_ai import get_chat_response  # PDF 기반 응답 생성 함수

react_address = os.getenv('REACT_APP_API_BASE_URL')

app = FastAPI(default_response_class=UJSONResponse)

# CORS 설정
origins = [
    react_address or "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 입력 메시지 모델
class Message(BaseModel):
    messages: Dict[str, Union[str, str]]

# 수정 요청용 모델
class ChatUpdate(BaseModel):
    content: str

# 루트 확인용
@app.get("/")
def read_root():
    return {"Hello": "World"}

# 💬 채팅 응답 처리
@app.post("/api/chat")
async def chat(message: Message):
    user_input = message.messages['content']
    save_chat("user", user_input)

    response_text = get_chat_response(user_input)
    save_chat("assistant", response_text)

    return {"response": response_text}

# 대화 이력 조회
@app.get("/api/chat_history")
async def chat_history():
    chat_list = get_chats()
    history = [
        {
            "id": c.id,
            "role": c.role,
            "content": c.content,
            "timestamp": c.timestamp.isoformat()
        }
        for c in chat_list
    ]
    return {"history": history}

# 대화 수정
@app.put("/api/chat/{chat_id}")
async def update_chat(chat_id: int, update: ChatUpdate):
    updated = update_chat_by_id(chat_id, update.content)
    if not updated:
        raise HTTPException(status_code=404, detail="Chat not found")
    return {"message": "Chat updated successfully"}

# 대화 삭제
@app.delete("/api/chat/{chat_id}")
async def delete_chat(chat_id: int):
    deleted = delete_chat_by_id(chat_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Chat not found")
    return {"message": "Chat deleted successfully"}
