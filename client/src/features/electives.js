import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ASYNC_STATUS, ASYNC_INIT_STATE } from "./util";
import { getApi } from "../api/api";

export const fetchElectives = createAsyncThunk(
  "electives/fetchElectives",
  (_, { rejectWithValue }) => {
    return fetch(getApi.electives)
      .then((response) => response.json())
      .catch((error) => rejectWithValue(error));
  }
);
const initialState = { ...ASYNC_INIT_STATE, electives: [] };

const electiveSlice = createSlice({
  name: "electives",
  initialState,
  reducers: {
    sortElectives: (state) => {
      state.electives = state.electives.sort((a, b) => {
        if (a.courseNumber < b.courseNumber) {
          return -1;
        }
        if (a.courseNumber > b.courseNumber) {
          return 1;
        }
        return 0;
      });
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchElectives.pending, (state) => {
        state.status = ASYNC_STATUS.LOADING;
      })
      .addCase(fetchElectives.fulfilled, (state, action) => {
        state.status = ASYNC_STATUS.SUCCEEDED;
        state.electives = action.payload;
      })
      .addCase(fetchElectives.rejected, (state, action) => {
        state.status = ASYNC_STATUS.FAILED;
        state.error = action.error.message;
      });
  },
});

export default electiveSlice.reducer;
export const { sortElectives } = electiveSlice.actions;
