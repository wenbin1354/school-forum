import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ASYNC_STATUS, ASYNC_INIT_STATE } from "./util";
import { getApi } from "../api/api";

const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  (courseId, { rejectWithValue }) => {
    return fetch(`${getApi.comments}/${courseId}`)
      .then((response) => response.json())
      .catch((error) => rejectWithValue(error));
  }
);
const initialState = {
  ...ASYNC_INIT_STATE,
  comments: [],
  filteredComments: [],
};

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    filteredComments: (state, action) => {
      state.filteredComments = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = ASYNC_STATUS.LOADING;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = ASYNC_STATUS.SUCCEEDED;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = ASYNC_STATUS.FAILED;
        state.error = action.error.message;
      });
  },
});

export default commentSlice.reducer;
export { fetchComments };
export const { filteredComments } = commentSlice.actions;
