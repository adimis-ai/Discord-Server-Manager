// EmptyDeck.tsx
import React from 'react';
import './EmptyDeck.css';

interface EmptyDeckProps {
  onAddDeck: (newDeck: [string, string, string | null, string | null]) => void;
  handleModalOpen: () => void;
}

const EmptyDeck: React.FC<EmptyDeckProps> = ({ onAddDeck, handleModalOpen }) => {
  // remove the lines related to modal state and functions

  return (
    <div className='empty-deck'>
      <div className='empty-deck-body'>
        <button onClick={handleModalOpen} className='empty-deck-button'>
          Add Deck
        </button>
      </div>
    </div>
  );
};

export default EmptyDeck;
