import { Modal, Stack, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { modalStyle } from "../util";
import { ASYNC_STATUS } from "../../features/util";
import { FORM_STATUS } from "../util";
import { isValidEmail } from "./util";
import { SendPasswordResetToUserEmail } from "../../api/firebaseAPI";

const ResetPassword = ({ isModalOpen, closeModal }) => {
  const currentUser = useSelector((store) => store.currentUser);
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [formStatus, setFormStatus] = useState(FORM_STATUS.IN_PROGRESS);

  useEffect(() => {
    setErrorMsg("");
    setFormStatus(FORM_STATUS.IN_PROGRESS);
    if (currentUser.status === ASYNC_STATUS.SUCCEEDED) {
      setEmail(currentUser.user.email);
    } else {
      setEmail("");
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (currentUser.status === ASYNC_STATUS.SUCCEEDED) {
      setEmail(currentUser.user.email);
    }
  }, [currentUser]);

  const onSubmitEmail = () => {
    setFormStatus(FORM_STATUS.SUBMITTING);

    if (!isValidEmail(email)) {
      setFormStatus(FORM_STATUS.IN_PROGRESS);
      setErrorMsg("Invalid Email");
      return;
    }

    SendPasswordResetToUserEmail(email).then(
      setFormStatus(FORM_STATUS.SUBMITTED)
    );
  };
  return (
    <Modal open={isModalOpen} onClose={closeModal}>
      <Stack sx={modalStyle} spacing={3} alignItems="center">
        <Stack alignItems="center" spacing={1}>
          <Typography>Reset Password</Typography>
          <Typography variant="caption" textAlign="center" maxWidth={250}>
            If the email entered below is registered, we will send you an email
            to reset password.
          </Typography>
          <Typography
            variant="caption"
            color="error"
            textAlign="center"
            maxWidth={250}
          >
            NOTE: the email WILL take a minute to arrive, and it is likely to be
            in your "Junk Mail"
          </Typography>
        </Stack>

        <TextField
          sx={{ width: 250 }}
          required
          label="Email"
          autoComplete="off"
          disabled={
            formStatus != FORM_STATUS.IN_PROGRESS ||
            currentUser.status === ASYNC_STATUS.SUCCEEDED
          }
          value={email}
          error={!!errorMsg}
          helperText={errorMsg}
          onChange={(val) => setEmail(val.target.value)}
        />
        <Stack alignItems="center">
          <LoadingButton
            sx={{ width: 250 }}
            size="large"
            onClick={onSubmitEmail}
            loading={formStatus === FORM_STATUS.SUBMITTING}
            disabled={formStatus != FORM_STATUS.IN_PROGRESS}
            variant="outlined"
          >
            <span>Reset Password</span>
          </LoadingButton>
          {formStatus === FORM_STATUS.SUBMITTED && (
            <Typography variant="caption" color="#2E7D32">
              Email is sent successfully!
            </Typography>
          )}
        </Stack>
      </Stack>
    </Modal>
  );
};
export default ResetPassword;
