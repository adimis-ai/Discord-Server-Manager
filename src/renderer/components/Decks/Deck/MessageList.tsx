// /home/adimis/Desktop/Simplifi/simplifids/src/renderer/components/Decks/Deck/MessageList.tsx
import React, { useState, useEffect } from "react";
import Message from "./Message";
import "../Decks.css";
import { MessageData } from '../../../modules/types';
import Pagination from '../Deck/Pagination';
import LoadMore from "./LoadMore";

interface MessageListProps {
  id: string; //deckID[0]
  messages: Array<MessageData>;
  offset: number;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
}

const MessageList: React.FC<MessageListProps> = ({ id, messages, offset, setOffset }) => {

  const [isLoading, setIsLoading] = useState<boolean>(window.electron.store.get(`loadingState.${id}`) || false);

  useEffect(() => {
    const checkLoadingState = () => {
      const loadingState = window.electron.store.get(`loadingState.${id}`) || false;
      setIsLoading(loadingState);
    };

    const interval = setInterval(checkLoadingState, 500); // Recheck every 1000 milliseconds (1 second)

    return () => {
      clearInterval(interval);
    };
  }, [id]);

  return (
    <>
      <LoadMore deckID={id}/>
      <div className="deck-messages">
        {messages.map((message, index) => (
          <Message 
            key={index}
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
            reactions={message.reactions}
          />
        ))}
      </div>
    </>
  );
};

export default MessageList