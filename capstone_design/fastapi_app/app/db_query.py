# db_query.py
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import os

# 환경변수에서 DB 정보 읽기
db_user = os.getenv('DB_USER')
db_password = os.getenv('DB_PASSWORD')
db_host = os.getenv('DB_HOST')
db_name = os.getenv('DB_NAME')

engine = create_engine(
    f"mysql+pymysql://{db_user}:{db_password}@{db_host}/{db_name}",
    pool_recycle=3600,
    echo=False
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# 채팅 테이블
class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String(10))   # 'user' or 'assistant'
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

# 채팅 저장
def save_chat(role: str, content: str):
    session = SessionLocal()
    try:
        new_chat = Chat(role=role, content=content)
        session.add(new_chat)
        session.commit()
    finally:
        session.close()

# 전체 채팅 불러오기
def get_chats():
    session = SessionLocal()
    try:
        return session.query(Chat).order_by(Chat.timestamp).all()
    finally:
        session.close()
