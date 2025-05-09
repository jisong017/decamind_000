from dotenv import load_dotenv
import os
from openai import OpenAI
from fastapi import FastAPI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
app = FastAPI()

def get_chat_response(message):
    MODEL = "gpt-3.5-turbo"
    
    system_message = {
        "role": "system",
        "content": (
            "당신은 기업의 지능형 챗봇입니다. "
            "사용자가 제품, 서비스, 정책, 절차 등에 대해 질의하면 신속하고 정확하며 공손하게 안내하세요. "
            "불필요한 감정 표현은 피하고, 항상 친절하고 전문적인 톤을 유지하세요. "
            "답변이 불확실할 경우 '확인 후 답변드리겠습니다'와 같이 응대하세요."
        )
    }

    user_message = {"role": "user", "content": message}
    messages = [system_message, user_message]
    
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            temperature=0.5,  # 더 안정적이고 포멀한 응답 유도
        )
        return response.choices[0].message.content
    except Exception as e:
        print(e)
        return "죄송합니다. 현재 답변을 불러오는 데 문제가 발생했습니다. 다시 시도해 주세요."
