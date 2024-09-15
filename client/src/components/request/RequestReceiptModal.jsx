import { Box, Button, Modal } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import RequestReceipt from "./RequestReceipt";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const RequestReceiptModal = ({ input }) => {
  const user = useSelector((store) => store.currentUser.user);
  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <Button onClick={handleOpen} variant="outlined">
        View Request Receipt
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <RequestReceipt input={input} user={user} />
        </Box>
      </Modal>
    </>
  );
};

export default RequestReceiptModal;
