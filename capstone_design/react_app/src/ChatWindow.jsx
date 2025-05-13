import React, {forwardRef, useEffect} from "react";
import "./ChatWindow.css"
import { FaRegStar, FaStar  } from "react-icons/fa6";


const ChatWindow = forwardRef(({ messages, onFavorite, favorites }, ref) => {
   
  useEffect(() => {
    console.log("messageRefs:", ref.current[messages.length - 1]);
    if(messages.length > 0 && ref.current[messages.length - 1]) {
        ref.current[messages.length - 1]?.scrollIntoView({
          behavior: "smooth", block: "start", 
        });
    }
}, [messages.length]);

    return (
        <div className={`chat-window ${messages.length === 0 ? "empty": ""}`}>
            {messages.length === 0 ?  (
                <div className="empty-chat-message">
                    대화를 시작하려면 <br/> 질문을 입력해주세요!
                </div>
            ) : (
                messages.map((message, index) => {
                    const isFavorite = favorites.some(
                        (fav) =>
                            fav.question === message.question
                    );
                    return (
                        <div 
                            key={index} 
                            className="message"
                            ref={(el) => {
                                ref.current[index]=el;
                            }}
                        >
                        <div className="user-message"> {message.question} </div>
                        <div className="bot-message"> 
                            <p>{message.answer?.text}</p> 
                        </div>
                        <button
                            className={`favorite-btn ${isFavorite ? "favorited" : ""}`}
                            onClick={() => onFavorite(message)}
                        > 
                            {isFavorite ?  <FaStar className="star"/> : <FaRegStar />} 
                        </button>
                    </div>
                    );
                })
            )}
        </div>
    );
});

export default ChatWindow;