import { combineReducers } from "@reduxjs/toolkit";
import serverData from "./serverData";
import deckManager from "./deckManager";
import bookmarks from "./bookmarksSlice";

const rootReducer = combineReducers({
  serverData: serverData,
  deckManager: deckManager,
  bookmarks: bookmarks,
});

export default rootReducer;
