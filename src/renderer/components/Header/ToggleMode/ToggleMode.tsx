import React, { useState, useEffect } from 'react';
import "./ToggleMode.css";
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";

interface ToggleModeProps {
  theme: 'dark' | 'light';
  setTheme: React.Dispatch<React.SetStateAction<'dark' | 'light'>>;
}

export default function ToggleMode({ theme, setTheme }: ToggleModeProps) {

  const [themeClass, setThemeClass] = useState('dark');

  useEffect(() => {
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(themeClass);
  }, [themeClass]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setThemeClass(newTheme);
  };

  const SunIcon = () => (
    <span role="img" aria-label="sun">
      <BsFillSunFill />
    </span>
  );

  const MoonIcon = () => (
    <span role="img" aria-label="moon">
      <BsFillMoonFill />
    </span>
  );

  return (
    <div className={`app ${theme}`}>
      <div className="toggle-theme">
        <div className="container">
          <div className="toggle">
            <input
              type="checkbox"
              checked={theme === 'light'}
              onChange={toggleTheme}
            />
            <span className="button"></span>
            <span className="label">
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
