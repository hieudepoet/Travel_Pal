'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types/types';
import { Send, Bot, User } from 'lucide-react';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    onSendMessage(input);
    setInput('');
  };

  // Define common styles
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      height: '600px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    },
    messagesContainer: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: '16px',
      backgroundColor: '#f9fafb',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px'
    },
    emptyState: {
      textAlign: 'center' as const,
      color: '#9ca3af',
      marginTop: '40px'
    },
    messageRow: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px'
    },
    messageBubble: {
      maxWidth: '75%',
      padding: '12px',
      borderRadius: '16px',
      fontSize: '14px',
      lineHeight: '1.4'
    },
    userMessage: {
      background: 'linear-gradient(to right, #f97316, #ea580c)',
      color: 'white',
      borderTopRightRadius: 0
    },
    botMessage: {
      backgroundColor: 'white',
      color: '#1f2937',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      borderTopLeftRadius: 0
    },
    avatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    },
    avatarUser: {
      backgroundColor: '#ffedd5',
      color: '#9a3412'
    },
    avatarBot: {
      backgroundColor: '#e5e7eb',
      color: '#4b5563'
    },
    form: {
      padding: '16px',
      backgroundColor: 'white',
      borderTop: '1px solid #e5e7eb',
      flexShrink: 0
    },
    formInner: {
      display: 'flex',
      gap: '8px'
    },
    input: {
      flex: 1,
      padding: '8px 16px',
      borderRadius: '9999px',
      border: '1px solid #d1d5db',
      outline: 'none',
      fontSize: '14px',
      color: '#111827',
      backgroundColor: 'white',
      transition: 'all 0.2s'
    },
    inputFocus: {
      borderColor: '#f97316',
      boxShadow: '0 0 0 2px rgba(249, 115, 22, 0.5)'
    },
    inputDisabled: {
      backgroundColor: '#f3f4f6',
      cursor: 'not-allowed'
    },
    button: {
      padding: '8px',
      background: 'linear-gradient(to right, #f97316, #ea580c)',
      color: 'white',
      border: 'none',
      borderRadius: '9999px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
    },
    buttonHover: {
      background: 'linear-gradient(to right, #ea580c, #c2410c)'
    },
    buttonDisabled: {
      background: 'linear-gradient(to right, #d1d5db, #9ca3af)',
      cursor: 'not-allowed'
    },
    loadingDots: {
      display: 'flex',
      gap: '4px'
    },
    dot: {
      width: '8px',
      height: '8px',
      backgroundColor: '#9ca3af',
      borderRadius: '50%',
      animation: 'bounce 1.4s infinite ease-in-out both'
    }
  };

  return (
    <div style={styles.container}>

      {/* Messages */}
      <div style={styles.messagesContainer}>
        {messages.length === 0 && (
          <div style={styles.emptyState}>
            <Bot style={{ width: '48px', height: '48px', margin: '0 auto 12px', color: '#d1d5db' }} />
            <p style={{ margin: 0, fontSize: '14px' }}>
              Hỏi tôi để thay đổi kế hoạch, thêm nhà hàng, hoặc kiểm tra thời tiết!
            </p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            style={{
              ...styles.messageRow,
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
            }}
          >
            <div 
              style={{
                ...styles.avatar,
                ...(msg.role === 'user' ? styles.avatarUser : styles.avatarBot)
              }}
            >
              {msg.role === 'user' ? (
                <User style={{ width: '16px', height: '16px' }} />
              ) : (
                <Bot style={{ width: '16px', height: '16px' }} />
              )}
            </div>
            
            <div 
              style={{
                ...styles.messageBubble,
                ...(msg.role === 'user' ? styles.userMessage : styles.botMessage)
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div style={styles.messageRow}>
            <div style={{ ...styles.avatar, ...styles.avatarBot }}>
              <Bot style={{ width: '16px', height: '16px' }} />
            </div>
            <div style={{ ...styles.messageBubble, ...styles.botMessage }}>
              <div style={styles.loadingDots}>
                <span style={{ ...styles.dot, animationDelay: '0s' }}></span>
                <span style={{ ...styles.dot, animationDelay: '0.1s' }}></span>
                <span style={{ ...styles.dot, animationDelay: '0.2s' }}></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form 
        onSubmit={handleSubmit} 
        style={styles.form}
      >
        <div style={styles.formInner}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Thay đổi kế hoạch..."
            disabled={isLoading}
            style={{
              ...styles.input,
              ...(isLoading && styles.inputDisabled),
              ...(document.activeElement === document.querySelector('input') && styles.inputFocus)
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#f97316';
              e.target.style.boxShadow = '0 0 0 2px rgba(249, 115, 22, 0.5)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            style={{
              ...styles.button,
              ...(isLoading || !input.trim() ? styles.buttonDisabled : {})
            }}
            onMouseOver={(e) => {
              if (!isLoading && input.trim()) {
                e.currentTarget.style.background = 'linear-gradient(to right, #ea580c, #c2410c)';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading && input.trim()) {
                e.currentTarget.style.background = 'linear-gradient(to right, #f97316, #ea580c)';
              }
            }}
            aria-label="Gửi tin nhắn"
          >
            <Send style={{ width: '20px', height: '20px' }} />
          </button>
        </div>
      </form>

      <style jsx global>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
