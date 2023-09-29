// /home/adimis/Desktop/Simplifi/simplifids/src/renderer/components/Decks/Deck/Deck.tsx
import { deleteDeck } from "../../../reducers/deckManager";
import { useDispatch } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";
import "../Decks.css";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";

import { Responsive, WidthProvider } from 'react-grid-layout';
const ResponsiveGridLayout = WidthProvider(Responsive);

import MessageList from "./MessageList";
import SendMessage from "../SendMessage";
import DeckHeader from "./DeckHeader";
import { deleteMessagesCache } from "../../../modules/api/apiHandler";

interface ResizeCallbackData {
  node: HTMLElement;
  size: { width: number; height: number };
  handle: string;
}

interface DeckProps {
  id: string;
  server: string;
  channel: string | null;
  user: string | null;
  onDeleteDeck: () => void;
  onMoveDeck: (direction: "left" | "right") => void;
  messages: Array<any>;
  offset: number;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
}

const Deck: React.FC<DeckProps> = ({
  id,
  server,
  channel,
  user,
  onDeleteDeck,
  onMoveDeck,
  messages,
  offset,
  setOffset,
}) => {
  console.log("DeckID from Deck.tsx: ", id)
  const dispatch = useDispatch();
  const [width, setWidth] = useState(400);

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const handleNotificationClick = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };
  
  const handleDeleteDeck = useCallback(() => {
    dispatch(deleteDeck(id));
    onDeleteDeck();
    deleteMessagesCache(id)
  }, [dispatch, id, onDeleteDeck]);

  useEffect(() => {
    window.electron.ipcRenderer.discordBot.updateNotifications(
      id,
      notificationsEnabled
    );
  }, [id, notificationsEnabled]);

  const onResize = (_event: React.SyntheticEvent, { size }: ResizeCallbackData) => {
    setWidth(size.width);
  };

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      minConstraints={[300, 0]}
      maxConstraints={[Infinity, 0]}
      axis="x"
      resizeHandles={["e"]}
    >
      <div className="deck" style={{ width }}>
        <DeckHeader
          server={server}
          channel={channel}
          user={user}
          deleteDeck={handleDeleteDeck}
          onMoveDeck={onMoveDeck}
          onNotificationClick={handleNotificationClick}
          notificationsEnabled={notificationsEnabled}
        />
        <MessageList id={id} messages={messages} offset={offset} setOffset={setOffset} />
        {channel && <SendMessage id={id} />}
      </div>
    </Resizable>
  );
};

export default Deck;