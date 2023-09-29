import React, { useState } from 'react';
import './BookmarksModalButton.css';
import BookmarksSidebar from './BookmarksSideBar';
import { BsFillBookmarkFill } from 'react-icons/bs';

const BookmarksModalButton: React.FC = () => {
  const [isBookmarkSidebarOpen, setIsBookmarkSidebarOpen] = useState(false);

  const handleSidebarOpen = () => {
    setIsBookmarkSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsBookmarkSidebarOpen(false);
  };

  const BookmarkIcon = () => (
    <span role="img" aria-label="bookmark">
      <BsFillBookmarkFill />
    </span>
  );

  return (
    <>
      <div className="bookmark_modal-theme">
        <label className="bookmark_modal" htmlFor="bookmark_modal-bookmark_modal">
          <input id="bookmark_modal-bookmark_modal" type="checkbox" onClick={handleSidebarOpen} />
          <span className="button"></span>
          <span className="label">
            <BookmarkIcon />
          </span>
        </label>
      </div>
      <BookmarksSidebar isOpen={isBookmarkSidebarOpen} onClose={handleSidebarClose} />
    </>
  );
};

export default BookmarksModalButton;
