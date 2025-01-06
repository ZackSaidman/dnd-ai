'use client';

//name ideas
// basements and bearded dragons
// bard party

import { useRouter } from 'next/navigation';
import styles from './styles/Home.module.css'

export default function Home() {
  const router = useRouter();

  const handleStartGame = (dm: string) => {
    router.push(`/character-creation?dm=${dm}`);
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        Dungeons and Dragons
      </h1>
      <h2 className={styles.subtext}>
        Choose your DM
      </h2>

      <div className={styles.buttonContainer}>
        {/* <button className={styles.button} onClick={() => handleStartGame('Claude')}>
          DM Claude
        </button> */}
        <button className={styles.button} onClick={() => handleStartGame('ChatGPT')}>
          DM ChatGPT
        </button>
      </div>
    </main>
  )
}