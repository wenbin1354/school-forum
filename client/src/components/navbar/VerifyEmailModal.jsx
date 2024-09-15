/* eslint-disable */
import { useState, useEffect } from "react";
import MarkAsUnreadIcon from "@mui/icons-material/MarkAsUnread";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { fetchUser } from "../../features/user";
import { SendEmailVerificationToCurrentUser } from "../../api/firebaseAPI";
import { Typography, Box, Modal, Stack, Button } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const VerifyEmailModal = ({ isModalOpen, closeModal }) => {
  const countdownInterval = 300; // In seconds
  const dispatch = useDispatch();
  const [countdown, setCountdown] = useState(countdownInterval);
  const currentUser = useSelector((store) => store.currentUser);

  const handleCountdown = () => {
    // Reset the countdown timer
    setCountdown(countdownInterval);
  };

  const handleResendVerification = () => {
    SendEmailVerificationToCurrentUser();
  };

  const handleVerification = () => {
    dispatch(fetchUser());
  };

  useEffect(() => {
    // Start a countdown timer that decrements the countdown every second
    const timer = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      }
    }, 1000);

    // Clear the timer when the component unmounts
    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <Modal open={isModalOpen} onClose={closeModal}>
      <Box sx={style}>
        {currentUser.user?.isVerified ?? false ? (
          <>
            <MarkEmailReadIcon sx={{ fontSize: 100, color: "green" }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                marginBottom: "14px",
                color: "green",
                textAlign: "center",
              }}
            >
              Your Email Address has been Verified!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{
                marginBottom: "20px",
              }}
              onClick={closeModal}
            >
              Back
            </Button>
          </>
        ) : (
          <Stack
            direction="column"
            spacing={2}
            alignItems="center"
            textAlign="center"
          >
            <MarkAsUnreadIcon sx={{ fontSize: 100, color: "green" }} />
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "green" }}
            >
              Please Verify Your Email
            </Typography>
            <Typography>You're almost there!</Typography>
            <Typography sx={{ marginBottom: "14px" }}>
              We've sent a verification email to
            </Typography>
            <Typography fontWeight="bold">{currentUser.user.email}</Typography>
            <Typography>
              Please check your <u>inbox</u> and <u>junk mail</u> and click the{" "}
              <b>verification link</b>.
            </Typography>
            <Typography>There is a delay in Hunter's email service</Typography>
            <Typography>
              it might take a <b>few minutes</b>!
            </Typography>
            <Typography>
              If you didn't receive the email, you can resend it in
            </Typography>
            <Typography color="green" sx={{ fontWeight: "bold" }}>
              {countdown}
            </Typography>
            <Typography>seconds</Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{
                marginBottom: "20px",
              }}
              onClick={() => {
                handleResendVerification();
                handleCountdown();
              }}
              disabled={countdown > 0}
            >
              Resend Verification
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleVerification}
              sx={{
                fontSize: "12px",
                backgroundColor: "blue",
                textTransform: "none",
              }}
            >
              I have verified my email
            </Button>
          </Stack>
        )}
      </Box>
    </Modal>
  );
};

export default VerifyEmailModal;
