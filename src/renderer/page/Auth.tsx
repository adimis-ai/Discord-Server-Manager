import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../modules/api/authHandler';
import './Auth.css';

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDiscordAuthRequired, setIsDiscordAuthRequired] = useState(false);

  useEffect(() => {
    const checkAuthData = async () => {
      const accessToken = await window.electron.store.get('access_token');
      console.log("accessToken check: ", accessToken)
      const refreshToken = await window.electron.store.get('refresh_token');
      console.log("refreshToken check: ", refreshToken)
      const subscriptionState = await window.electron.store.get('subscriptionState');
      console.log("subscriptionState check: ", subscriptionState)

      if (accessToken && refreshToken && subscriptionState && !window.electron.store.get('discordToken')) {
        setIsDiscordAuthRequired(true);
      } else {
        setIsDiscordAuthRequired(false);
      }
    };

    checkAuthData();
  }, []);

  const handleAuthDiscord = async () => {
    await window.electron.ipcRenderer.discordBot.authenticateDiscord();
  };

  const onSubmit = async (e) => {
    console.log('Form submit event:', e);
    e.preventDefault();
    console.log('Preventing default form submission');
    setIsLoading(true);
    console.log('Setting isLoading to true');
    setError('');
    console.log('Clearing error');

    if (isSignUp) {
      try {
        await registerUser(username, email, password);
        console.log('User registered:', username, email, password);
        await window.electron.store.set('email', email);
        console.log('Email stored:', email);
        setIsSignUp(false);
        console.log('Setting isSignUp to false');
        setIsLoading(false);
        console.log('Setting isLoading to false');
      } catch (error) {
        setError(error);
        console.error('Error occurred during registration:', error);
        setIsLoading(false);
        console.log('Setting isLoading to false');
      }
    } else {
      try {
        const response = await loginUser(email, password);
        await window.electron.store.set('email', email);

        console.log('User logged in:', response);

        const { accessToken, refreshToken, subscriptionState } = response;
        console.log('Response received:', response);

        await window.electron.store.set('access_token', accessToken);
        console.log('Access token stored:', accessToken);
        await window.electron.store.set('refresh_token', refreshToken);
        console.log('Refresh token stored:', refreshToken);
        await window.electron.store.set('subscriptionState', subscriptionState);
        console.log('Subscription State stored:', subscriptionState);
        await window.electron.store.set("authState", true)

        if (
          accessToken &&
          refreshToken &&
          !subscriptionState
        ) {
          setIsLoading(false);
          console.log("PlanID", window.electron.store.get('selectedPlanId'))
          console.log('Setting isLoading to false');
          navigate('/pricing');
          console.log('Navigating to /pricing');
        } else if (accessToken && refreshToken && subscriptionState) {
          setIsLoading(false);
          console.log('Setting isLoading to false');

          const discordToken = await window.electron.store.get(
            'discordToken'
          );
          if (!discordToken) {
            setIsDiscordAuthRequired(true);
            return;
          }

          navigate('/');
          console.log('Navigating to /');
        }
      } catch (error) {
        setError(error);
        console.error('Error occurred during login:', error);
        setIsLoading(false);
        console.log('Setting isLoading to false');
      }
    }
  };

  return (
    <div className="auth-container">
      <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
      {error && <div className="auth-error">{error}</div>}
      <form onSubmit={onSubmit} className="auth-form">
        {!isDiscordAuthRequired && isSignUp && (
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
        )}
        {(isSignUp || !isDiscordAuthRequired) && (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </>
        )}
        {!isDiscordAuthRequired && !isSignUp && (
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Sign In'}
          </button>
        )}
        {!isDiscordAuthRequired && isSignUp && (
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Sign Up'}
          </button>
        )}
        {isDiscordAuthRequired && (
          <button type="button" disabled={isLoading} onClick={handleAuthDiscord}>
            {isLoading ? 'Loading...' : 'Authenticate with Discord'}
          </button>
        )}
      </form>
      <p>
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <span onClick={() => setIsSignUp(!isSignUp)} className="auth-toggle">
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </span>
      </p>
    </div>
  );
};

export default Auth;