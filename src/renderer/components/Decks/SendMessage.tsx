// src/renderer/components/SendMessage.tsx
import React, { useState } from 'react';
import './Decks.css';
import { sendMessage } from '../../modules/api/apiHandler'; // <-- Import the correct function

interface SendMessageProps {
  id: string;
}

const SendMessage: React.FC<SendMessageProps> = ({ id }) => {
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = async () => {
    await sendMessage(id, inputMessage);
    setInputMessage('');
  };

  return (
    <div className="send-message">
      <textarea
        placeholder="Type your message here"
        className="message-input"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      ></textarea>
      <button onClick={handleSendMessage} className="message-send">
        Send
      </button>
    </div>
  );
};

export default SendMessage;
