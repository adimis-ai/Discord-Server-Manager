import React, { useState, useEffect } from 'react';
import './DeckHeader.css';
import { AiFillDelete } from 'react-icons/ai';
import { IoMdNotifications } from 'react-icons/io';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { IoMdNotificationsOff } from 'react-icons/io';
import { deleteMessagesCache } from '../../../modules/api/apiHandler';

interface DeckHeaderProps {
  server: string;
  channel: string | null;
  user: string | null;
  deleteDeck: () => void;
  onMoveDeck: (direction: 'left' | 'right') => void;
  onNotificationClick: () => void;
  notificationsEnabled: boolean;
}

const DeckHeader: React.FC<DeckHeaderProps> = ({
  server,
  channel,
  user,
  deleteDeck,
  onMoveDeck,
  onNotificationClick,
  notificationsEnabled,
}) => {

  const [memberName, setMemberName] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchMemberName = async () => {
      try {
        const name = await window.electron.ipcRenderer.cache.searchMemberName(user);
        setMemberName(name);
      } catch (error) {
        console.error('Error fetching member name:', error);
      }
    };

    fetchMemberName();
  }, [user]);

  return (
    <div className="deck-header">
      <div className="deck-header-arrow-left" onClick={() => onMoveDeck('left')}>
        <IoIosArrowBack />
      </div>

      <div className="deck-header-notification" onClick={onNotificationClick}>
        {notificationsEnabled ? <IoMdNotifications /> : <IoMdNotificationsOff />}
      </div>
      <div>
        <h3 className="deck-title">
          {server} #{channel} @{memberName}
        </h3>
      </div>
      <div className="deck-header-delete" onClick={deleteDeck}>
        <AiFillDelete />
      </div>

      <div className="deck-header-arrow-right" onClick={() => onMoveDeck('right')}>
        <IoIosArrowForward />
      </div>
    </div>
  );
};

export default DeckHeader;
