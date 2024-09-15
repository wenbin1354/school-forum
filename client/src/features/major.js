import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ASYNC_STATUS, ASYNC_INIT_STATE } from "./util";
import { getApi } from "../api/api";

export const fetchMajors = createAsyncThunk(
  "majors/fetchMajors",
  (_, { rejectWithValue }) => {
    return fetch(getApi.majors)
      .then((response) => response.json())
      .catch((error) => rejectWithValue(error));
  }
);

const initialState = { ...ASYNC_INIT_STATE, majors: [] };
const majorSlice = createSlice({
  name: "majors",
  initialState,
  reducers: {
    sortMajors: (state) => {
      state.majors = state.majors.sort((a, b) => {
        if (a.majorName < b.majorName) {
          return -1;
        }
        if (a.majorName > b.majorName) {
          return 1;
        }
        return 0;
      });
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMajors.pending, (state) => {
        state.status = ASYNC_STATUS.LOADING;
      })
      .addCase(fetchMajors.fulfilled, (state, action) => {
        state.status = ASYNC_STATUS.SUCCEEDED;
        state.majors = action.payload;
      })
      .addCase(fetchMajors.rejected, (state, action) => {
        state.status = ASYNC_STATUS.FAILED;
        state.error = action.error.message;
      });
  },
});

export default majorSlice.reducer;
export const { sortMajors } = majorSlice.actions;
