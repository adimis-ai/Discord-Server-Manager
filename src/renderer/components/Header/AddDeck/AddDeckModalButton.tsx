import React, { useState } from 'react';
import './AddDeckButton.css';
import AddDeckModalBox from './AddDeckModalBox';
import { AiOutlinePlus } from "react-icons/ai";

interface AddDeckModalButtonProps {
  onAddDeck: (newDeck: [string, string, string | null, string | null]) => void;
}

const AddDeckModalButton: React.FC<AddDeckModalButtonProps> = ({ onAddDeck }) => {
  const [isAddDeckModalOpen, setIsAddDeckModalOpen] = useState(false);
  const handleModalOpen = () => {
    setIsAddDeckModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddDeckModalOpen(false);
  };

  const AddDeckIcon = () => (
    <span role="img" aria-label="bookmark">
      <AiOutlinePlus />
    </span>
  );

  return (
    <>
      <div className="addDeck-theme">
        <label className="addDeck" htmlFor="addDeck-addDeck">
          <input id="addDeck-addDeck" type="checkbox" onClick={handleModalOpen} />
          <span className="button"></span>
          <span className="label">
            <AddDeckIcon />
          </span>
        </label>
      </div>
      {isAddDeckModalOpen && <AddDeckModalBox onClose={handleModalClose} onAddDeck={onAddDeck} />}
    </>
  );
};

export default AddDeckModalButton;
