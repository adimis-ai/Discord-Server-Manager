import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MessageData } from '../modules/types';

interface BookmarksState {
    messages: MessageData[];
  }
  
  const initialState: BookmarksState = {
    messages: [],
  };
  
  const bookmarksSlice = createSlice({
    name: 'bookmarks',
    initialState,
    reducers: {
      addBookmark: (state, action: PayloadAction<MessageData>) => {
        state.messages.push(action.payload);
      },
      removeBookmark: (state, action: PayloadAction<string>) => {
        state.messages = state.messages.filter((message) => message.id !== action.payload);
      },
    },
  });
  
  export const { addBookmark, removeBookmark } = bookmarksSlice.actions;
  
  export default bookmarksSlice.reducer;