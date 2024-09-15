/* eslint-disable */
import {
  Box,
  Modal,
  Stack,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";

import { LoginWithEmailAndPassword } from "../../api/firebaseAPI";
import { fetchUser } from "../../features/user";

import { FORM_STATUS } from "../util";
import { verifyLogInInput } from "./util";
import { modalStyle } from "../util";

const LogIn = ({ isModalOpen, closeModal, openSignUp, openResetPassword }) => {
  const dispatch = useDispatch();
  const [input, setInput] = useState({ email: "", password: "" });
  const [formStatus, setFormStatus] = useState(FORM_STATUS.IN_PROGRESS);
  const [inputError, setInputError] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const onLoginButtonClick = async () => {
    // Lock inputs
    setFormStatus(FORM_STATUS.SUBMITTING);

    // Verify inputs
    const verificationError = verifyLogInInput(input.email, input.password);
    setInputError(verificationError);
    const isVerified = !Object.keys(verificationError).length;

    if (!isVerified) {
      setFormStatus(FORM_STATUS.IN_PROGRESS);
      return;
    }
    setFormStatus(FORM_STATUS.SUBMITTED);

    LoginWithEmailAndPassword(input.email, input.password)
      .then(() => {
        dispatch(fetchUser());
        closeModal();
      })
      .catch((error) => {
        setFormStatus(FORM_STATUS.IN_PROGRESS);
        setInputError({
          email: "Invalid email or password credentials",
          password: "Invalid email or password credentials",
        });
      });
  };

  useEffect(() => {
    setInput({ email: "", password: "" });
    setInputError({});
    setIsPasswordVisible(false);
    setFormStatus(FORM_STATUS.IN_PROGRESS);
  }, [isModalOpen]);

  return (
    <Modal open={isModalOpen} onClose={closeModal}>
      <Box sx={modalStyle}>
        <Stack
          direction="column"
          spacing={3}
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h5" fontWeight={"bold"}>
            Log In
          </Typography>
          <TextField
            sx={{ width: 250 }}
            required
            id="email"
            label="Email"
            autoComplete="off"
            disabled={formStatus != FORM_STATUS.IN_PROGRESS}
            error={!!inputError.email}
            helperText={inputError.email}
            onChange={(val) => setInput({ ...input, email: val.target.value })}
          />
          <TextField
            sx={{ width: 250 }}
            required
            id="password"
            label="Password"
            type={isPasswordVisible ? "text" : "password"}
            autoComplete="off"
            disabled={formStatus != FORM_STATUS.IN_PROGRESS}
            error={!!inputError.password}
            helperText={inputError.password}
            onChange={(val) =>
              setInput({ ...input, password: val.target.value })
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {isPasswordVisible ? (
                    <VisibilityIcon
                      fontSize="small"
                      onClick={togglePasswordVisibility}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <VisibilityOffIcon
                      fontSize="small"
                      onClick={togglePasswordVisibility}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </InputAdornment>
              ),
            }}
          />

          <LoadingButton
            sx={{ width: 250 }}
            size="large"
            onClick={onLoginButtonClick}
            loading={formStatus === FORM_STATUS.SUBMITTING}
            disabled={formStatus != FORM_STATUS.IN_PROGRESS}
            variant="outlined"
          >
            <span>Log In</span>
          </LoadingButton>
          <Stack>
            <Typography variant="caption" sx={{ textAlign: "center" }}>
              Don&rsquo;t have an account?&nbsp;
              <span
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => {
                  closeModal();
                  openSignUp();
                }}
              >
                Sign up
              </span>
            </Typography>
            <Typography
              variant="caption"
              sx={{ textAlign: "center", cursor: "pointer", color: "blue" }}
              onClick={() => {
                closeModal();
                openResetPassword();
              }}
            >
              Forgot password
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default LogIn;
