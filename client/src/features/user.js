import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { ASYNC_STATUS, ASYNC_INIT_STATE } from "./util";
import { getApi } from "../api/api";

export const fetchUser = createAsyncThunk(
	"user/fetchUser",
	(_, { rejectWithValue }) => {
		return fetch(getApi.user)
			.then((response) => {
				if (response.status === 403) throw new Error("Unauthenticated");
				return response.json();
			})
			.catch((error) => rejectWithValue(error));
	}
);

export const fetchAdmin = createAsyncThunk(
	"user/fetchAdmin",
	(_, { rejectWithValue }) => {
		return fetch(getApi.admin)
			.then((response) => {
				return response.json();
			})
			.catch((error) => rejectWithValue(error));
	}
);

export const updateCurrentUser = createAction("user/updateCurrentUser");

const initialState = {
	...ASYNC_INIT_STATE,
	user: { admin: { status: ASYNC_STATUS.IDLE } },
};
const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		logout: (state) => {
			state.status = ASYNC_STATUS.IDLE;
			state.user = { admin: { status: ASYNC_STATUS.IDLE } };
			state.error = "";
		},
	},
	extraReducers(builder) {
		builder
			.addCase(fetchUser.pending, (state) => {
				state.status = ASYNC_STATUS.LOADING;
				state.error = "";
			})
			.addCase(fetchUser.fulfilled, (state, action) => {
				state.status = ASYNC_STATUS.SUCCEEDED;
				state.user = { ...action.payload, admin: state.user.admin };
			})
			.addCase(fetchUser.rejected, (state, action) => {
				state.status = ASYNC_STATUS.FAILED;
				state.error = action.error.message;
			})
			.addCase(fetchAdmin.pending, (state) => {
				state.user.admin.status = ASYNC_STATUS.LOADING;
			})
			.addCase(fetchAdmin.fulfilled, (state, action) => {
				state.user.admin.status = ASYNC_STATUS.SUCCEEDED;
				state.user.admin.isAdmin = action.payload.isSuperUser;
			})
			.addCase(fetchAdmin.rejected, (state, action) => {
				state.user.admin.status = ASYNC_STATUS.FAILED;
				state.user.admin.error = action.error.message;
			})
			.addCase(updateCurrentUser, (state, action) => {
				state.user = action.payload;
			});
	},
});

export default userSlice.reducer;
export const { logout } = userSlice.actions;
