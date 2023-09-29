import React, { useState } from 'react';
import './SettingsModal.css';
import SettingsModalBox from './SettingsModalBox';
import { FiSettings } from "react-icons/fi";

const SettingsModalButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="modal-theme">
        <label className="modal" htmlFor="modal-modal">
          <input id="modal-modal" type="checkbox" onClick={handleModalOpen} />
          <span className="button"></span>
          <span className="label">
            <FiSettings />
          </span>
        </label>
      </div>
      {isModalOpen && <SettingsModalBox onClose={handleModalClose} />}
    </>
  );
};

export default SettingsModalButton;
