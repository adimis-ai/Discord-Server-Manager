// /home/adimis/Desktop/Simplifi/simplifids/src/renderer/components/Header/Bookmarks/BookmarksSideBar.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import './BookmarksModal.css';
import Message from '../../Decks/Deck/Message';

interface BookmarksSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookmarksSidebar: React.FC<BookmarksSidebarProps> = ({ isOpen, onClose }) => {
  const bookmarkedMessages = useSelector((state: RootState) => state.bookmarks.messages);

  return (
      <div className={`bookmarks-sidebar${isOpen ? ' open' : ''}`}>
        <button className="bookmarks-sidebar-close-button" onClick={onClose}>
          Close
        </button>
        <h2>Bookmarks</h2>
        <div className='bookmarks-container'>
          <div className="bookmarked-messages">
            {bookmarkedMessages.map((message) => (
              <Message
                key={message.id}
                id={message.id}
                type={message.type}
                content={message.content}
                channel_id={message.channel_id}
                author={message.author}
                attachments={message.attachments}
                embeds={message.embeds}
                mentions={message.mentions}
                mention_roles={message.mention_roles}
                pinned={message.pinned}
                mention_everyone={message.mention_everyone}
                tts={message.tts}
                timestamp={message.timestamp}
                edited_timestamp={message.edited_timestamp}
                flags={message.flags}
                components={message.components}
                message_reference={message.message_reference}
                hit={message.hit}
                images={message.images}
                authorName={message.authorName}
                authorId={message.authorId}
                channelId={message.channelId}
                channelName={message.channelName}
                guildId={message.guildId}
                roleColor={message.roleColor}
                reply={message.reply}
                createdTimestamp={message.createdTimestamp}
                avatarURL={message.avatarURL}
              />
            ))}
          </div>
        </div>
      </div>
  );
};

export default BookmarksSidebar;
