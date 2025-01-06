'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export type Message = {
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDm(searchParams.get('dm'));
    const characterParam = searchParams.get('character');
    if (characterParam) {
      setCharacter(JSON.parse(decodeURIComponent(characterParam)));
    }
  }, [searchParams]);

  const switchDm = () => {
    // const newDm = dm === 'Claude' ? 'ChatGPT' : 'Claude';
    const newDm = 'ChatGPT'
    setDm(newDm);
    router.push(`/game?dm=${newDm}`);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const playerMessage: Message = { sender: 'Player', content: inputMessage };
      setChatHistory(prev => [...prev, playerMessage]);

      setInputMessage('');
      setIsLoading(true);

      try {
        // Call the Lambda function through the API route
        const response = await fetch('/game/api/call-dm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(playerMessage),
        });
        console.log(response)

        if (!response.ok) {
          throw new Error('Failed to fetch DM response');
        }

        const data = await response.json();
        const dmResponse: Message = { sender: 'DM', content: data.message };

        setChatHistory(prev => [...prev, dmResponse]);
      } catch (error) {
        console.error('Error fetching DM response:', error);
        setChatHistory(prev => [
          ...prev,
          { sender: 'DM', content: 'An error occurred while fetching the DM response.' },
        ]);
      } finally {
        setIsLoading(false);
      }
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
        {isLoading && <div className={styles.loading}>Loading DM response...</div>}
      </div>

      <form onSubmit={handleSendMessage} className={styles.inputForm}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message here..."
          className={styles.inputBox}
          disabled={isLoading}
        />
        <button type="submit" className={styles.button} disabled={isLoading}>
          Send
        </button>
      </form>

      <button className={styles.button} onClick={() => router.push('/')}>
        Back to Home
      </button>
    </main>
  );
}
