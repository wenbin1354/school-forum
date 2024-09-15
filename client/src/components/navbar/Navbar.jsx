import { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import LogInIcon from "@mui/icons-material/LogIn";
import {
  AppBar,
  Box,
  Typography,
  Toolbar,
  TextField,
  Button,
  IconButton,
  Divider,
  Autocomplete,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import VerifyEmailModal from "./VerifyEmailModal";
import UserDropdown from "./UserDropdown";

import theme from "../../theme/theme";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import Sidebar from "../sidebar/Sidebar";
import ResetPassword from "./ResetPassword";

import HunterLogo from "../../assets/hunter_logo.png";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";

import { ASYNC_STATUS } from "../../features/util";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export default function PrimarySearchAppBar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { electives } = useSelector((store) => store.electiveList);
  const currentUser = useSelector((store) => store.currentUser);
  const [isLogInOpen, setIsLogInOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isVerifyEmailModalOpen, setIsVerifyEmailModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);

  const handleSearchSelected = (electiveId) => {
    if (!electiveId) return;
    navigate(`/elective/${electiveId}`);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar
            color="primary"
            sx={{
              boxShadow: "none",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
          >
            <Toolbar>
              <Box
                sx={{
                  display: { xs: "flex", md: "flex", lg: "none" },
                  marginLeft: "-2%",
                }}
              >
                <IconButton
                  size="large"
                  aria-label="dropdown sidebar"
                  aria-haspopup="true"
                  color="inherit"
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="hunter logo"
                sx={{
                  mr: 2,
                  display: { xs: "none", sm: "none", md: "block", lg: "block" },
                }}
                onClick={() => navigate("/home")}
              >
                <img
                  src={HunterLogo}
                  alt="Logo"
                  style={{ width: "40px", height: "40px" }}
                />
              </IconButton>
              <Typography
                variant="h5"
                noWrap
                component="div"
                sx={{
                  display: { xs: "none", sm: "none", md: "none", lg: "block" },
                  marginRight: {
                    xs: "0%",
                    sm: "5%",
                    md: "10%",
                    lg: "15%",
                  },
                }}
              >
                Hunter Elective Forum
              </Typography>

              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <Autocomplete
                  id="searchbar"
                  margin="dense"
                  sx={{
                    backgroundColor: "rgba(200, 200, 200, 0.2)",
                    borderRadius: "16px",
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        border: "none",
                      },
                    ".MuiInputBase-input": {
                      color: "black",
                    },
                    paddingLeft: "2rem",
                    width: {
                      xs: "90%", // Width for xs breakpoint
                      sm: 200, // Width for sm breakpoint
                      md: 300, // Width for md breakpoint
                      lg: 400, // Width for lg breakpoint
                    },
                  }}
                  forcePopupIcon={false}
                  options={electives}
                  getOptionLabel={(elective) =>
                    elective.courseNumber + " " + elective.courseName
                  }
                  hiddenlabel="true"
                  onChange={(_, value) =>
                    handleSearchSelected(value?.courseNumber)
                  }
                  renderInput={(params) => (
                    <TextField
                      placeholder="Search for a Course ID/Title"
                      {...params}
                      variant="outlined"
                    />
                  )}
                />
              </Search>

              <Box sx={{ flexGrow: 1 }} />
              {currentUser.status === ASYNC_STATUS.SUCCEEDED ? (
                <UserDropdown
                  openVerifyEmailModal={() => setIsVerifyEmailModalOpen(true)}
                  openResetPasswordModal={() =>
                    setIsResetPasswordModalOpen(true)
                  }
                />
              ) : (
                <Button
                  size="large"
                  variant="text"
                  color="inherit"
                  sx={{ width: 200 }}
                  onClick={() => setIsLogInOpen(true)}
                >
                  <LogInIcon color="inherit" sx={{ marginRight: 1 }} />
                  Log In
                </Button>
              )}
            </Toolbar>
            <Divider />
          </AppBar>
        </Box>
      </ThemeProvider>
      <Toolbar />
      <LogIn
        isModalOpen={isLogInOpen}
        closeModal={() => setIsLogInOpen(false)}
        openSignUp={() => setIsSignUpModalOpen(true)}
        openResetPassword={() => setIsResetPasswordModalOpen(true)}
      />
      <SignUp
        isModalOpen={isSignUpModalOpen}
        closeModal={() => setIsSignUpModalOpen(false)}
        openSignIn={() => setIsLogInOpen(true)}
        openVerifyEmail={() => setIsVerifyEmailModalOpen(true)}
      />
      <VerifyEmailModal
        isModalOpen={isVerifyEmailModalOpen}
        closeModal={() => setIsVerifyEmailModalOpen(false)}
      />
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <ResetPassword
        isModalOpen={isResetPasswordModalOpen}
        closeModal={() => setIsResetPasswordModalOpen(false)}
      />
    </div>
  );
}
