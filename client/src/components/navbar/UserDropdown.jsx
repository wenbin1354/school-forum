/* eslint-disable react/prop-types */
import { useState } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import {
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Badge,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import MarkAsUnreadIcon from "@mui/icons-material/MarkAsUnread";
import LockResetIcon from "@mui/icons-material/LockReset";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import CommentIcon from "@mui/icons-material/Comment";
import { logout } from "../../features/user";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserDropdown = ({ openVerifyEmailModal, openResetPasswordModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((store) => store.currentUser);
  const requestCount = useSelector(
    (store) => store.requestList.requests
  ).length;
  const { displayName } = currentUser.user;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const logOut = async () => {
    // delete request to /api/logout, credentials include
    await fetch("/api/logout", {
      method: "DELETE",
      credentials: "include",
    }).then(() => {
      dispatch(logout());
    });
  };

  return (
    <List sx={{ minWidth: 200, bgcolor: "background.paper" }}>
      <ListItemButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <ListItemText sx={{ textAlign: "center" }}>
          {currentUser.user.admin.isAdmin ? (
            <Badge color="error" badgeContent="Admin">
              <Typography variant="button" width="inherit">
                {displayName}
              </Typography>
            </Badge>
          ) : (
            <Typography variant="button" width="inherit">
              {displayName}
            </Typography>
          )}
        </ListItemText>
      </ListItemButton>
      <Collapse in={isDropdownOpen} timeout="auto">
        <List
          disablePadding
          sx={{
            position: "absolute",
            marginTop: 1,
            width: "inherit",
            backgroundColor: "background.paper",
          }}
        >
          <>
            {currentUser.user.admin.isAdmin && (
              <ListItemButton
                sx={{ borderBottom: 0.5 }}
                onClick={() => {
                  navigate("/view-request");
                }}
              >
                <ListItemIcon>
                  <Badge color="error" badgeContent={requestCount}>
                    <FiberNewIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="button">Requests</Typography>
                </ListItemText>
              </ListItemButton>
            )}

            {currentUser.user.admin.isAdmin || (
              <ListItemButton
                sx={{ borderBottom: 0.5 }}
                onClick={() => {
                  navigate("/mycomments");
                  setIsDropdownOpen(false);
                }}
              >
                <ListItemIcon>
                  <CommentIcon />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="button">My Comments</Typography>
                </ListItemText>
              </ListItemButton>
            )}

            {currentUser.user.admin.isAdmin || (
              <ListItemButton
                sx={{ borderBottom: 0.5 }}
                onClick={openVerifyEmailModal}
              >
                <ListItemIcon>
                  {currentUser.user.isVerified ? (
                    <MarkEmailReadIcon />
                  ) : (
                    <MarkAsUnreadIcon />
                  )}
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="button">Verify Email</Typography>
                </ListItemText>
              </ListItemButton>
            )}

            <ListItemButton
              sx={{ borderBottom: 0.5 }}
              onClick={openResetPasswordModal}
            >
              <ListItemIcon>
                <LockResetIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="button">Reset Password</Typography>
              </ListItemText>
            </ListItemButton>

            <ListItemButton sx={{ borderBottom: 0.5 }} onClick={logOut}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="button">Log Out</Typography>
              </ListItemText>
            </ListItemButton>
          </>
        </List>
      </Collapse>
    </List>
  );
};

export default UserDropdown;
