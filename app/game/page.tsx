'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css'

type Message = {
  sender: 'Player' | 'DM';
  content: string;
};

type Character = {
  class: string;
  stats: Record<string, number>;
};

export default function Game() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dm, setDm] = useState<string | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    setDm(searchParams.get('dm'));
    const characterParam = searchParams.get('character');
    if (characterParam) {
      setCharacter(JSON.parse(decodeURIComponent(characterParam)));
    }
  }, [searchParams]);

  const switchDm = () => {
    const newDm = dm === 'Claude' ? 'ChatGPT' : 'Claude';
    setDm(newDm);
    router.push(`/game?dm=${newDm}`);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const playerMessage: Message = { sender: 'Player', content: inputMessage };
      setChatHistory(prev => [...prev, playerMessage]);
      
      // Simulate DM response (replace this with actual API call to Claude or ChatGPT)
      setTimeout(() => {
        const dmResponse: Message = { sender: 'DM', content: `${dm} responds: Hello, adventurer!` };
        setChatHistory(prev => [...prev, dmResponse]);
      }, 1000);

      setInputMessage('');
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dungeons and Dragons</h1>
        <button className={`${styles.button} ${styles.dmToggle}`} onClick={switchDm}>
          DM: {dm}
        </button>
      </div>
      
      <div className={styles.chatContainer}>
        {chatHistory.map((message, index) => (
          <div key={index} className={`${styles.message} ${styles[message.sender.toLowerCase()]}`}>
            <strong>{message.sender}:</strong> {message.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className={styles.inputForm}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message here..."
          className={styles.inputBox}
        />
        <button type="submit" className={styles.button}>Send</button>
      </form>

      <button className={styles.button} onClick={() => router.push('/')}>
        Back to Home
      </button>
    </main>
  )
}