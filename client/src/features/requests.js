import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ASYNC_STATUS, ASYNC_INIT_STATE } from "./util";
import { getApi } from "../api/api";

export const fetchRequests = createAsyncThunk(
  "requests/fetchRequests",
  (_, { rejectWithValue }) => {
    return fetch(getApi.requests)
      .then((response) => response.json())
      .catch((error) => rejectWithValue(error));
  }
);
const initialState = { ...ASYNC_INIT_STATE, requests: [] };

const requestSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    sortRequests: (state) => {
      state.major = state.requests
        .filter((request) => request.input.requestOption === "major")
        .sort((a, b) => {
          if (a.input.majorName < b.input.majorName) {
            return -1;
          }
          if (a.input.majorName > b.input.majorName) {
            return 1;
          }
          return 0;
        });

      state.elective = state.requests
        .filter((request) => request.input.requestOption === "elective")
        .sort((a, b) => {
          if (a.input.courseNumber < b.input.courseNumber) {
            return -1;
          }
          if (a.input.courseNumber > b.input.courseNumber) {
            return 1;
          }
          return 0;
        });

      state.elective = state.elective.map((elective) => {
        return { ...elective, input: { ...elective.input, catalogLink: "" } };
      });
    },
    addMajorTemplate: (state) => {
      state.major.push({
        input: {
          requestOption: "major",
          majorName: "",
          submissionTime: Date.now(),
        },
        user: { email: "Request Template" },
      });
    },
    addElectiveTemplate: (state) => {
      state.elective.push({
        input: {
          requestOption: "elective",
          courseNumber: "",
          courseName: "",
          courseMajor: [],
          submissionTime: Date.now(),
          catalogLink: "",
        },
        user: { email: "Request Template" },
      });
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.status = ASYNC_STATUS.LOADING;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.status = ASYNC_STATUS.SUCCEEDED;
        state.requests = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.status = ASYNC_STATUS.FAILED;
        state.error = action.error.message;
      });
  },
});

export default requestSlice.reducer;
export const { sortRequests, addMajorTemplate, addElectiveTemplate } =
  requestSlice.actions;
