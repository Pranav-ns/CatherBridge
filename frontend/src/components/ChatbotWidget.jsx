import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Bot, Loader2 } from 'lucide-react';
import api from '../services/api';
import './ChatbotWidget.css';

const ChatbotWidget = ({ isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am the CaterBridge AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await api.post('/chat', { message: userMessage });
      if (response.data.success) {
        setMessages(prev => [...prev, { sender: 'bot', text: response.data.reply }]);
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I am having trouble connecting right now.' }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg = error.response?.data?.message || 'Sorry, something went wrong on our end.';
      setMessages(prev => [...prev, { sender: 'bot', text: errorMsg }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      {/* Floating Action Button */}
      {!isOpen && (
        <button className="chatbot-fab" onClick={() => setIsOpen(true)}>
          <MessageSquare size={24} color="#fff" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <Bot size={20} color="var(--primary-color)" />
              </div>
              <div>
                <h3 className="chatbot-title">CaterBridge Support</h3>
                <p className="chatbot-status">Typically replies instantly</p>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chatbot-message ${msg.sender === 'user' ? 'message-user' : 'message-bot'}`}>
                {msg.sender === 'bot' && (
                  <div className="chatbot-msg-avatar">
                    <Bot size={14} color="var(--primary-color)" />
                  </div>
                )}
                <div className="chatbot-msg-bubble">
                  {msg.text}
                </div>
                {msg.sender === 'user' && (
                  <div className="chatbot-msg-avatar user-avatar">
                    <User size={14} color="#fff" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="chatbot-message message-bot">
                <div className="chatbot-msg-avatar">
                  <Bot size={14} color="var(--primary-color)" />
                </div>
                <div className="chatbot-msg-bubble typing-indicator">
                  <span>.</span><span>.</span><span>.</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input-area" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isTyping}
            />
            <button type="submit" disabled={!input.trim() || isTyping} className="chatbot-send-btn">
              {isTyping ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
