'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../styles/Home.module.css';

const classes = ['Fighter', 'Wizard', 'Rogue', 'Cleric'];
const stats = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'];

export default function CharacterCreation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dm = searchParams.get('dm');

  const [characterClass, setCharacterClass] = useState('');
  const [characterStats, setCharacterStats] = useState<Record<string, number>>(
    Object.fromEntries(stats.map(stat => [stat, 10]))
  );

  const handleStatChange = (stat: string, value: number) => {
    setCharacterStats(prev => ({...prev, [stat]: value}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const character = {
      class: characterClass,
      stats: characterStats
    };
    router.push(`/game?dm=${dm}&character=${encodeURIComponent(JSON.stringify(character))}`);
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Create Your Character</h1>
      <form onSubmit={handleSubmit} className={styles.characterForm}>
        <div className={styles.formSection}>
          <label htmlFor="class">Choose your class:</label>
          <select 
            id="class" 
            value={characterClass} 
            onChange={(e) => setCharacterClass(e.target.value)}
            required
            className={styles.selectInput}
          >
            <option value="">Select a class</option>
            {classes.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className={styles.formSection}>
          <h2>Set your stats:</h2>
          {stats.map(stat => (
            <div key={stat} className={styles.statInput}>
              <label htmlFor={stat}>{stat}:</label>
              <input 
                type="number" 
                id={stat} 
                value={characterStats[stat]} 
                onChange={(e) => handleStatChange(stat, parseInt(e.target.value))}
                min="3" 
                max="18"
                required
                className={styles.numberInput}
              />
            </div>
          ))}
        </div>
        <button type="submit" className={styles.button}>Create Character</button>
      </form>
    </main>
  );
}