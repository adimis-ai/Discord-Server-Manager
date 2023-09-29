import React from 'react';
import AddDeckModalButton from './AddDeck/AddDeckModalButton';
import ToggleMode from './ToggleMode/ToggleMode';
import SettingsModalButton from './Settings/SettingsModalButton';
import BookmarksModalButton from './Bookmarks/BookmarksModalButton';
import './HeaderLayout.css';

// Import the logo
//import logo from 'renderer/assets/icon.png';

interface HeaderLayoutProps {
  onAddDeck: (newDeck: [string, string, string | null, string | null]) => void;
  theme: 'dark' | 'light';
  setTheme: React.Dispatch<React.SetStateAction<'dark' | 'light'>>;
}

const HeaderLayout: React.FC<HeaderLayoutProps> = ({ onAddDeck, theme, setTheme }) => {
  return (
    <div className="header-container">
      <AddDeckModalButton onAddDeck={onAddDeck} />
      <ToggleMode theme={theme} setTheme={setTheme} />
 
      <SettingsModalButton />
      <BookmarksModalButton />
    </div>
  );
};

export default HeaderLayout;
