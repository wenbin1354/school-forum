import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import MyCommentsPage from "./pages/MyCommentsPage";
import Course from "./components/course/Course";
import RequestForm from "./components/request/RequestForm";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Rate from "./components/rate/Rate";
import { Stack } from "@mui/material";
import { Routes, Route, Link } from "react-router-dom";
import { fetchElectives, sortElectives } from "./features/electives";
import { fetchMajors, sortMajors } from "./features/major";
import { fetchUser, fetchAdmin } from "./features/user";
import {
  addElectiveTemplate,
  addMajorTemplate,
  fetchRequests,
  sortRequests,
} from "./features/requests";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { ASYNC_STATUS } from "./features/util";
import ViewRequest from "./components/request/ViewRequest";

function App() {
  const majorList = useSelector((store) => store.majorList);
  const electiveList = useSelector((store) => store.electiveList);
  const currentUser = useSelector((store) => store.currentUser);
  const requestList = useSelector((store) => store.requestList);
  const [status, setStatus] = useState(ASYNC_STATUS.IDLE);
  const dispatch = useDispatch();
  const emptyTheme = createTheme();

  useEffect(() => {
    if (majorList.status === ASYNC_STATUS.IDLE) {
      dispatch(fetchMajors());
    }

    if (majorList.status === ASYNC_STATUS.IDLE) {
      dispatch(fetchElectives());
    }

    if (
      currentUser.status === ASYNC_STATUS.IDLE ||
      currentUser.status === ASYNC_STATUS.FAILED
    ) {
      dispatch(fetchUser());
    }

    setStatus(ASYNC_STATUS.LOADING);
  }, []);

  useEffect(() => {
    if (majorList.status === ASYNC_STATUS.SUCCEEDED) {
      dispatch(sortMajors());
    }
  }, [majorList.majors]);

  useEffect(() => {
    if (electiveList.status === ASYNC_STATUS.SUCCEEDED) {
      dispatch(sortElectives());
    }
  }, [electiveList.electives]);

  useEffect(() => {
    if (status === ASYNC_STATUS.IDLE || status === ASYNC_STATUS.LOADING) {
      if (
        majorList.status === ASYNC_STATUS.FAILED ||
        electiveList.status === ASYNC_STATUS.FAILED
      ) {
        setStatus(ASYNC_STATUS.FAILED);
      } else if (
        majorList.status === ASYNC_STATUS.SUCCEEDED &&
        electiveList.status === ASYNC_STATUS.SUCCEEDED
      ) {
        setStatus(ASYNC_STATUS.SUCCEEDED);
      }
    }
  }, [majorList.status, electiveList.status]);

  useEffect(() => {
    if (
      currentUser.status === ASYNC_STATUS.SUCCEEDED &&
      currentUser.user.admin.status === ASYNC_STATUS.IDLE
    ) {
      dispatch(fetchAdmin());
    }
  }, [currentUser.status]);

  useEffect(() => {
    if (currentUser.user.admin.isAdmin) {
      dispatch(fetchRequests());
    }
  }, [currentUser.user.admin.isAdmin]);

  useEffect(() => {
    if (requestList.status === ASYNC_STATUS.SUCCEEDED) {
      dispatch(sortRequests());
      dispatch(addMajorTemplate());
      dispatch(addElectiveTemplate());
    }
  }, [requestList.status]);

  return (
    <ThemeProvider theme={emptyTheme}>
      <Stack alignItems="center">
        <Routes>
          {status === ASYNC_STATUS.LOADING && (
            <Route path="*" element={<div>Site Loading</div>} />
          )}
          {status === ASYNC_STATUS.FAILED && (
            <Route path="*" element={<div>Failed to load</div>} />
          )}
          {status === ASYNC_STATUS.SUCCEEDED && (
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="Home" element={<HomePage />} />
              <Route path="/elective/:id" element={<Course />} />
              <Route path="/request" element={<RequestForm />} />
              <Route path="*" element={<NoMatch />} />
              <Route path="/rate" element={<Rate />} />
              <Route path="/mycomments" element={<MyCommentsPage />} />
              {requestList.status === ASYNC_STATUS.SUCCEEDED && (
                <Route path="/view-request" element={<ViewRequest />} />
              )}
            </Route>
          )}
        </Routes>
      </Stack>
    </ThemeProvider>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

export default App;
