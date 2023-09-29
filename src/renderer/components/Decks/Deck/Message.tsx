import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageData } from '../../../modules/types';
import { addBookmark, removeBookmark } from '../../../reducers/bookmarksSlice';
import { RootState } from '../../../store';
import "./Message.css";
import { sendReply } from '../../../modules/api/apiHandler'; 
import { openDiscordUrl } from '../../../modules/api/apiHandler';

import { BsFillBookmarkPlusFill, BsBookmarkCheckFill } from 'react-icons/bs';
import { BsPersonCircle } from 'react-icons/bs';
import { IoIosArrowDropleftCircle } from 'react-icons/io';
import { FiExternalLink } from 'react-icons/fi'; // Import the icon
import { IoPaperPlaneOutline } from 'react-icons/io5';
import { MdPushPin } from 'react-icons/md';

const Message: React.FC<MessageData> = ({ 
  id,
  type,
  content,
  channel_id,
  author,
  attachments,
  embeds,
  mentions,
  mention_roles,
  pinned,
  mention_everyone,
  tts,
  timestamp,
  edited_timestamp,
  flags,
  components,
  message_reference,
  hit,
  images,
  authorName,
  authorId,
  channelId,
  channelName,
  guildId,
  roleColor,
  reply,
  reactions,
  createdTimestamp,
  avatarURL
 }) => { 
  const dispatch = useDispatch();
  const bookmarkedMessages = useSelector((state: RootState) => state.bookmarks.messages);
  const isBookmarked = bookmarkedMessages.some((bookmarkedMessage) => bookmarkedMessage.id === id);

  function formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

    if (diff < 1) {
      // Today or Yesterday
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      const isToday = date.getTime() >= today.getTime();
      const isYesterday = date.getTime() >= yesterday.getTime() && date.getTime() < today.getTime();
      const dayString = isToday ? 'Today' : isYesterday ? 'Yesterday' : '';

      const hours = date.getHours();
      const minutes = date.getMinutes();
      const amPm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `[${dayString} at ${formattedHours}:${formattedMinutes} ${amPm}]`;
    } else {
      // Other days
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayString = weekdays[date.getDay()];

      const month = date.toLocaleString('default', { month: 'short' });
      const day = date.getDate();
      const year = date.getFullYear();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const amPm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${dayString} ${month} ${day}, ${year} at ${formattedHours}:${formattedMinutes} ${amPm}`;
    }
  }
  
  const time = formatTimestamp(parseInt(createdTimestamp));
  const [replyMode, setReplyMode] = React.useState(false);
  const [replyToMessageId, setReplyToMessageId] = React.useState("");
  const [replyMessageContent, setReplyMessageContent] = React.useState("");

  const textSize = window.electron.store.get("textSize") || 1.0;
  const imageSize = window.electron.store.get("imageSize") || 1.0;

  const handleBookmarkClick = () => {
    if (!isBookmarked) {
      dispatch(addBookmark({ id, type, content, channel_id, author, attachments, embeds, mentions, mention_roles, pinned, mention_everyone, tts, timestamp, edited_timestamp, flags, components, message_reference, hit, images, authorName, authorId, channelId, channelName, guildId, roleColor, reply, reactions, createdTimestamp, avatarURL }));
    } else {
      dispatch(removeBookmark(id));
    }
  };

  const BookmarkIcon = isBookmarked ? <BsBookmarkCheckFill /> : <BsFillBookmarkPlusFill />;

  const cleanMessage = (message: string | undefined) => {
    const mentionRegex = /<@!?(\d+)>|<@&(\d+)>|<#(\d+)>/g;
    const emojiRegex = /<a?:\w+:(\d+)>/g;
    const discriminatorRegex = /\d{17,21}#\d{4}/g;
    return (message || '')
      .replace(mentionRegex, '')
      .replace(emojiRegex, '')
      .replace(discriminatorRegex, '');
  };  

  const openDiscordMessage = async (url: string) => {
    if (window.confirm("Are you sure you want to open this message in Discord?")) {
      await openDiscordUrl(url);
    }
  };

  const handleReplyMessage = async (messageChannelID: string, id: string, replyMessageContent: string) => {
    const sent = await sendReply(messageChannelID, id, replyMessageContent);
    setReplyMode(false);
    setReplyMessageContent("");
  };

  const handleReplyClick = (id: string) => {
    setReplyMode(!replyMode);
    setReplyToMessageId(id);
  }; 

  const avatar = author && author.avatar ? <img src={author.avatar} alt="User Avatar" className="user-avatar-img" /> : <BsPersonCircle />;

  return (
    <div className="message">
      <div className="message-avatar">
        <img src={avatarURL} alt="User Avatar" className="user-avatar-img" />
      </div>

      <div className="message-info">

        <div className='message-header'>
          <div className='message-header-top'>
            <strong className="message-username" style={{ color: roleColor }}>{authorName}</strong>
            <strong className='message-channelName'>{channelName}</strong>
          </div>
          <div className='message-action-buttons'>
            <button className='message-reply' onClick={() => handleReplyClick(id)}>
              <IoIosArrowDropleftCircle />
            </button>
            <button
              className="message-open-discord"
              onClick={(e) => {
                e.stopPropagation();
                openDiscordMessage(`https://discord.com/channels/${guildId}/${channelId}/${id}`);
              }}
            >
              <FiExternalLink />
            </button>
            <button className='message-bookmark' onClick={handleBookmarkClick}>
              {BookmarkIcon}
            </button>
            {pinned && <MdPushPin />}
          </div>

        </div>

        <div className='message-body'>
          {reply && reply.content && reply.authorId && reply.authorName && (
            <div className="replied-message-container">
              <div className="replied-message" style={{ fontSize: `${textSize}rem` }}>
                <strong className='replied-message-user'>@{reply.authorName}: </strong >
                <strong className='replied-message-content'>{cleanMessage(reply.content)}</strong>
                <div className="connecting-line"></div>
              </div>
            </div>
          )}

          <div className="message-content" style={{ fontSize: `${textSize}rem` }}>
            {cleanMessage(content)}
          </div>

          {(images || []).length > 0 && (images || []).map((image, index) =>
            <img
              key={index}
              src={image}
              alt="message-image"
              className="message-image"
              style={{ width: `${imageSize * 100}%` }}
            />
          )}

          {replyMode && replyToMessageId === id && (
            <div className="message-reply-input">
              <input
                type="text"
                className="reply-input"
                placeholder="Write a reply..."
                value={replyMessageContent}
                onChange={(e) => setReplyMessageContent(e.target.value)}
              />
              <button
                className="send-reply"
                onClick={() =>
                  handleReplyMessage(channel_id, id, replyMessageContent)
                }
              >
                <IoPaperPlaneOutline className="send-reply-icon" />
              </button>
            </div>
          )}
        </div>

        <div className='message-footer'>
          {reactions?.map((reaction, index) => (
            <div key={index} className="message-reaction-body">
              <span className="message-reaction-item">
                <span className="message-reaction">{reaction.id}</span>
                <span className="message-reaction-count">{reaction.count}</span>
              </span>
            </div>
          ))}

          <div className='message-datetime'>
            <strong className="message-time">{formatTimestamp(Date.parse(createdTimestamp))}</strong>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Message;
