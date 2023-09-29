import React, { useState, useEffect, useCallback } from 'react';
import Loader from '../components/Extra/Loader';
import HeaderLayout from '../components/Header/HeaderLayout';
import DecksContainer from '../components/Decks/DecksContainer';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const email = window.electron.store.get("email")

  const [decks, setDecks] = useState<Array<[string, string, string | null, string | null]>>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [ loading, setLoading ] = useState(false);
  const [ auth, setAuth ] = useState(false);
  const [ subscribed, setSubscription ] = useState(false);

  const addDeck = useCallback((newDeck: [string, string, string | null, string | null]) => {
    setDecks((prevState) => [...prevState, newDeck]);
  }, []);

  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      const authState = await window.electron.store.get("authState")
      const subscriptionState = await window.electron.store.get("subscriptionState")
      if (!authState || !subscriptionState) {
          navigate('/auth');
      } else {
        setAuth(true)
        setSubscription(true)
         window.electron.ipcRenderer.discordBot.authenticateDiscordSilent()
      }
    };
    checkAuthAndNavigate();
  }, [navigate]);

  return (
    <>
    {loading ? (
      <Loader/>
    ) : (
      <div className='app-container'>
        <HeaderLayout onAddDeck={addDeck} theme={theme} setTheme={setTheme} />
        <DecksContainer decks={decks} setDecks={setDecks} />
      </div>
    )}
    </>
  );
}