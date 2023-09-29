// /home/adimis/Desktop/Simplifi/simplifids/src/renderer/components/Decks/DecksContainer.tsx
import React, { useState, useEffect } from 'react';
import Deck from './Deck/Deck';
import { RootState } from "../../store";
import "./Decks.css";
import { fetchAndUpdateMessages } from '../../modules/messages/handleMessages';
import { useSelector, useDispatch } from "react-redux";
import EmptyDeck from './Deck/EmptyDeck';
import AddDeckModalBox from '../Header/AddDeck/AddDeckModalBox';
import Loader from '../Extra/Loader';

import SimpleBar from 'simplebar-react'; // Import the SimpleBar component
import 'simplebar/dist/simplebar.min.css'; // Import the library's CSS file


interface DecksContainerProps {
  decks: Array<[string, string , string | null, string | null]>;
  setDecks: React.Dispatch<React.SetStateAction<Array<[string, string , string | null, string | null]>>>;
}

const DecksContainer: React.FC<DecksContainerProps> = ({ decks, setDecks }) => {
  const allDecks = useSelector((state: RootState) => state.deckManager.decks);
  const dispatch = useDispatch();
  const [deckMessages, setDeckMessages] = useState<{ [key: string]: Array<any> }>({});
  const [isAddDeckModalOpen, setIsAddDeckModalOpen] = useState(false);
  const [offset, setOffset] = useState(0);

  const deleteDeck = (index: number) => {
    setDecks(decks.filter((_, i) => i !== index));
  };

  const addDeck = (newDeck: [string, string, string | null, string | null]) => {
    setDecks([...decks, newDeck]);
  };

  const handleModalOpen = () => {
    setIsAddDeckModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddDeckModalOpen(false);
  };

  const moveDeck = (index: number, direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < decks.length) {
      const updatedDecks = [...decks];
      [updatedDecks[index], updatedDecks[newIndex]] = [updatedDecks[newIndex], updatedDecks[index]];
      setDecks(updatedDecks);
    }
  };
 
  useEffect(() => {
    const updateMessages = async () => {
      const updatedDeckMessages: { [key: string]: Array<any> } = {};
      for (const deck of decks) {
        // console.log("Deck[0] FROM DecksContainer.tsx: ", deck[0])
        const updatedMessage = await fetchAndUpdateMessages(deck[0], String(offset) ,dispatch);
        const currentDeckIndex = allDecks.findIndex((d) => d.id === deck[0]);
        if (currentDeckIndex !== -1) {
          const updatedDecks = [...allDecks];
          updatedDecks[currentDeckIndex] = {
            ...updatedDecks[currentDeckIndex],
            messages: updatedMessage,
          };
          updatedDeckMessages[deck[0]] = updatedMessage;
        }
      }
      // console.log("updatedDeckMessages == ",updatedDeckMessages)
      setDeckMessages(updatedDeckMessages);
    };
    const interval = setInterval(updateMessages, 1000);
    return () => clearInterval(interval);
  }, [decks, dispatch, allDecks, offset]);

  return (
    <div className="decks-outer-container">
      <SimpleBar style={{ maxHeight: '100%', width: '100%' }}>
        <div className="decks-container">
          {decks.map((deck, index) => {
            const messages = deckMessages[deck[0]] || [];
            return (
              <Deck
                key={`deck-${index}`}
                id={deck[0]}
                server={deck[1]}
                channel={deck[2]}
                user={deck[3]}
                onDeleteDeck={() => deleteDeck(index)}
                onMoveDeck={(direction) => moveDeck(index, direction)}
                messages={messages}
                offset={offset}
                setOffset={setOffset}
              />
            );
          })}
          {isAddDeckModalOpen && (
            <AddDeckModalBox onClose={handleModalClose} onAddDeck={addDeck} />
          )}
        </div>
      </SimpleBar>
    </div>
  );  
};

export default DecksContainer;