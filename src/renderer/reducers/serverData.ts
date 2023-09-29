import { createSlice } from "@reduxjs/toolkit";

interface DiscordData {
  serverData: Array<any>;
}

const initialState: DiscordData = {
  serverData: [],
};

export const serverData = createSlice({
  name: "serverData",
  initialState,
  reducers: {
    setServerData: (state, action) => {
      state.serverData = action.payload;
    },
  },
});

export const { setServerData } = serverData.actions;

export const getServerData = (state: any) => state.serverData.serverData;

export const deleteServerData = () => (dispatch: any) => {
  dispatch(setServerData([]));
};

export default serverData.reducer;
