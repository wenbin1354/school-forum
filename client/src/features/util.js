export const ASYNC_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
};

export const ASYNC_INIT_STATE = {
  status: ASYNC_STATUS.IDLE,
  error: "",
};

export const api = {
  electives: "/api/electives",
  majors: "/api/majors",
};
