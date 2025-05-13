import React, {useState, useRef, useEffect} from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";

import './App.css'

const App = () =>  {
  const [conversations, setConversations] = useState([
    {title: "대화 목록1", messages: [] },
    {title: "대화 목록2", messages: [] },
  ]);
  const [selectedConversation, setSelectedConversation] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const messageRefs = useRef([]);

  const createNewConversation = () => { 
    const newConversation = { title: `대화 목록 ${conversations.length + 1}`, messages: [], favorites: [] };
    setConversations([...conversations, newConversation]);
    setSelectedConversation(conversations.length);
  };

  const handleDeleteConversation = (index) => {
    const updatedConversations = conversations.filter((_, idx) => idx !== index);
    setConversations(updatedConversations);

    if (selectedConversation === index) {
      setSelectedConversation(0);
    }
    else if (selectedConversation > index) {
      setSelectedConversation(selectedConversation - 1);
    }
  };

  const handleRenameConversation = (index) => {
    const newTitle = prompt("새로운 대화 제목을 입력하세요", conversations[index].title);
    if (newTitle !== null && newTitle.trim() !== "") {
      const updatedConversations = [...conversations];
      updatedConversations[index].title = newTitle;
      setConversations(updatedConversations);
    }
  };

  const handleSendMessage = (message) => {
    const updatedConversations = [...conversations];
    updatedConversations[selectedConversation].messages.push({
      question: message,
      answer: {
        text: "답변 준비중입니다..."
      }
    });
    setConversations(updatedConversations);
  }

  const handleFavoriteMessage = (message) => {
    const updatedConversations = [...conversations];
    
    if (!updatedConversations[selectedConversation].favorites) {
      updatedConversations[selectedConversation].favorites = [];
    }

    const currentFavorites = updatedConversations[selectedConversation].favorites;
    if (currentFavorites.some((fav) => fav.question === message.question)) {
      updatedConversations[selectedConversation].favorites = currentFavorites.filter(
        (fav) => fav.question !== message.question
      );
    } else {
      updatedConversations[selectedConversation].favorites.push({question:message.question})
    }
    setConversations(updatedConversations);
  };

  const handleScrollToMessage = (targetMessage) => {
    const currentMessages = conversations[selectedConversation]?.messages || [];
    const index = currentMessages.findIndex(
      (m) => (m.question?.trim() || "") === (targetMessage.question?.trim() || "")
    );
    if (index !== -1 && messageRefs.current[index]) {
      messageRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      console.error("message not found", targetMessage);
    }
  };

  return (
    <div className="app">
      <div className="sidebar-section">
        <Sidebar 
          conversations={conversations} 
          onSelectConversation={setSelectedConversation}
          onCreateConversation={createNewConversation}
          selectedConversation={selectedConversation}
          onDeleteConversation={handleDeleteConversation}
          onRenameConversation={handleRenameConversation}
          favorites={conversations[selectedConversation]?.favorites || []}
          onScrollToMessage={handleScrollToMessage}
        /> 
      </div>
     
        <div className="chat-section"> 
          <ChatWindow 
            messages={conversations[selectedConversation]?.messages || []} 
            onFavorite={handleFavoriteMessage}
            favorites={conversations[selectedConversation]?.favorites || []}
            ref={messageRefs}
          />
          <MessageInput onSend={handleSendMessage} />
        </div>
    </div>
  );
};

export default App
