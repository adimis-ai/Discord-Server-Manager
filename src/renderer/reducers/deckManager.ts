import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageData } from "../modules/types";

interface Deck {
  id: string;
  server: string;
  channel: string | null;
  user: string | null;
  messages: Array<MessageData>;
}

interface DeckManagerState {
  decks: Array<Deck>;
}

const initialState: DeckManagerState = {
  decks: [],
};

export const deckManagerSlice = createSlice({
  name: "deckManager",
  initialState,
  reducers: {
    addDeck: (state, action: PayloadAction<Deck>) => {
      state.decks.push(action.payload);
      return state;
    },
    deleteDeck: (state, action: PayloadAction<string>) => {
      state.decks = state.decks.filter((deck) => deck.id !== action.payload);
    },
    updateDeck: (state, action: PayloadAction<Deck>) => {
      const index = state.decks.findIndex((deck) => deck.id === action.payload.id);
      if (index !== -1) {
        state.decks[index] = action.payload;
      }
    },
    updateMessage: (state, action: PayloadAction<{ deckId: string; updatedMessage: MessageData }>) => {
      const { deckId, updatedMessage } = action.payload;
      const deckIndex = state.decks.findIndex((deck) => deck.id === deckId);
      if (deckIndex !== -1) {
        const messageIndex = state.decks[deckIndex].messages.findIndex(
          (message) => message.id === updatedMessage.id
        );
        if (messageIndex !== -1) {
          state.decks[deckIndex].messages[messageIndex] = updatedMessage;
        }
      }
    },
  },
});

export const { addDeck, deleteDeck, updateDeck, updateMessage } = deckManagerSlice.actions;

export default deckManagerSlice.reducer;
