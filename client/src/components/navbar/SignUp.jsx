/* eslint-disable react/prop-types */
import {
  Modal,
  Stack,
  TextField,
  Typography,
  Box,
  InputAdornment,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState, useEffect } from "react";
import { FORM_STATUS, modalStyle } from "../util";
import { verifySignUpInput } from "./util";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { LoginWithEmailAndPassword } from "../../api/firebaseAPI";
import { fetchUser } from "../../features/user";
import { useDispatch } from "react-redux";
import { SendEmailVerificationToCurrentUser } from "../../api/firebaseAPI";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { ASYNC_STATUS } from "../../features/util";

const SignUp = ({ isModalOpen, closeModal, openSignIn, openVerifyEmail }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((store) => store.currentUser);
  const initInput = {
    email: "",
    displayName: "",
    password: "",
    confirmPassword: "",
  };
  const [input, setInput] = useState(initInput);
  const [formStatus, setFormStatus] = useState(FORM_STATUS.IN_PROGRESS);
  const [inputError, setInputError] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const onSignUpClicked = () => {
    // Lock inputs
    setFormStatus(FORM_STATUS.SUBMITTING);

    // Verify inputs
    const newInputError = verifySignUpInput(input);

    if (Object.keys(newInputError).length) {
      setInputError(newInputError);
      setFormStatus(FORM_STATUS.IN_PROGRESS);
      return;
    }

    const userInfo = {
      email: input.email,
      displayName: input.displayName,
      password: input.password,
    };
    fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(userInfo),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then(() => {
      LoginWithEmailAndPassword(input.email, input.password)
        .then(() => {
          dispatch(fetchUser());
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };

  useEffect(() => {
    if (
      formStatus === FORM_STATUS.SUBMITTING &&
      currentUser.status === ASYNC_STATUS.SUCCEEDED
    ) {
      SendEmailVerificationToCurrentUser();
      setFormStatus(FORM_STATUS.SUBMITTED);
      openVerifyEmail();
      closeModal();
    }
  }, [currentUser.status]);

  useEffect(() => {
    setInput(initInput);
    setInputError({});
    setFormStatus(FORM_STATUS.IN_PROGRESS);
    setIsPasswordVisible(false);
    setIsConfirmPasswordVisible(false);
  }, [isModalOpen]);

  return (
    <Modal open={isModalOpen} onClose={closeModal}>
      <Box>
        <Stack
          direction="column"
          spacing={3}
          justifyContent="center"
          alignItems="center"
          padding={6}
          width={300}
          sx={modalStyle}
        >
          <Typography variant="h5" fontWeight={"bold"}>
            SignUp
          </Typography>
          <TextField
            sx={{ width: 250 }}
            required
            label="Email"
            autoComplete="off"
            disabled={formStatus != FORM_STATUS.IN_PROGRESS}
            error={!!inputError.email}
            helperText={inputError.email}
            onChange={(val) => setInput({ ...input, email: val.target.value })}
          />

          <Stack alignItems="center">
            <TextField
              sx={{ width: 250 }}
              required
              id="displayName"
              label="Display Name"
              autoComplete="off"
              disabled={formStatus != FORM_STATUS.IN_PROGRESS}
              error={!!inputError.displayName}
              helperText={inputError.displayName}
              onChange={(val) =>
                setInput({ ...input, displayName: val.target.value })
              }
            />
            <Typography variant="caption" color="grey">
              You will be able to comment anonymously
            </Typography>
          </Stack>

          <Stack alignItems="center">
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
            <Typography variant="caption" color="grey">
              Password should be at least 6 digits long
            </Typography>
          </Stack>
          <TextField
            sx={{ width: 250 }}
            required
            id="confirmPassword"
            label="Confirm Password"
            type={isConfirmPasswordVisible ? "text" : "password"}
            autoComplete="off"
            disabled={formStatus != FORM_STATUS.IN_PROGRESS}
            error={!!inputError.confirmPassword}
            helperText={inputError.confirmPassword}
            onChange={(val) =>
              setInput({ ...input, confirmPassword: val.target.value })
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {isConfirmPasswordVisible ? (
                    <VisibilityIcon
                      fontSize="small"
                      onClick={toggleConfirmPasswordVisibility}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <VisibilityOffIcon
                      fontSize="small"
                      onClick={toggleConfirmPasswordVisibility}
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
            onClick={onSignUpClicked}
            loading={formStatus === FORM_STATUS.SUBMITTING}
            disabled={formStatus != FORM_STATUS.IN_PROGRESS}
            variant="outlined"
          >
            <span>Sign Up</span>
          </LoadingButton>
          <Typography variant="caption" sx={{ textAlign: "center" }}>
            Already have an account?&nbsp;
            <span
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => {
                closeModal();
                openSignIn();
              }}
            >
              Log in
            </span>
          </Typography>
        </Stack>
      </Box>
    </Modal>
  );
};

export default SignUp;
