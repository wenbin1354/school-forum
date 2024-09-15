import LoadingButton from "@mui/lab/LoadingButton";
import { MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import ElectiveFields from "./ElectiveFields";
import MajorFields from "./MajorFields";
import RequestReceiptModal from "./RequestReceiptModal";
import { formatInput, verifyInput } from "./util";
import { FORM_STATUS } from "../util";
import { createRequest } from "../../api/api";

import { ASYNC_STATUS } from "../../features/util";

const requestOptions = [
  {
    value: "major",
    label: "Major",
  },
  {
    value: "elective",
    label: "Elective",
  },
];

const RequestForm = () => {
  const currentUser = useSelector((store) => store.currentUser);
  const { electives } = useSelector((store) => store.electiveList);
  const { majors } = useSelector((store) => store.majorList);

  const initInput = {
    // General
    comment: "",
    // Major
    majorName: "",
    //Elective
    courseNumber: "",
    courseName: "",
    courseMajor: [],
  };

  const [input, setInput] = useState({
    // General
    requestOption: "major",
    ...initInput,
  });
  const [formStatus, setFormStatus] = useState(FORM_STATUS.IN_PROGRESS);
  const [inputError, setInputError] = useState({});

  useEffect(() => {
    setInput({ requestOption: input.requestOption, ...initInput });
    setInputError({});
  }, [input.requestOption]);

  const onSubmissionClicked = () => {
    // Lock inputs
    setFormStatus(FORM_STATUS.SUBMITTING);
    setInputError({});

    // Verify inputs
    const formattedInput = formatInput(input);
    const newInputError = verifyInput(formattedInput, majors, electives);

    if (Object.keys(newInputError).length) {
      setInputError(newInputError);
      setFormStatus(FORM_STATUS.IN_PROGRESS);
      return;
    }

    // Call API to /api/create_request
    createRequest({
      input: formattedInput,
      user: {
        uid: currentUser.user.uid,
        email: currentUser.user.email,
      },
    }).then(() => {
      setFormStatus(FORM_STATUS.SUBMITTED);
    });
  };

  return (
    <Stack
      spacing={3}
      alignItems="center"
      sx={{
        width: {
          md: 400,
          lg: 600, // Width for lg breakpoint
        },
      }}
      padding={3}
    >
      <TextField
        fullWidth
        select
        label="Request"
        defaultValue="major"
        disabled={formStatus != FORM_STATUS.IN_PROGRESS}
        onChange={(val) =>
          setInput({ ...input, requestOption: val.target.value })
        }
      >
        {requestOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      {input.requestOption === "major" && (
        <MajorFields
          input={input}
          setInput={setInput}
          error={inputError}
          disabled={formStatus != FORM_STATUS.IN_PROGRESS}
        />
      )}
      {input.requestOption === "elective" && (
        <ElectiveFields
          input={input}
          setInput={setInput}
          error={inputError}
          disabled={formStatus != FORM_STATUS.IN_PROGRESS}
        />
      )}
      <TextField
        fullWidth
        label="Comments (Optional)"
        placeholder="Is there anything else that we should know?"
        value={input.comment}
        rows={3}
        onChange={(val) => setInput({ ...input, comment: val.target.value })}
        disabled={formStatus != FORM_STATUS.IN_PROGRESS}
        multiline
      />
      <Stack direction="column" alignItems="center" spacing={1}>
        {formStatus != FORM_STATUS.SUBMITTED && (
          <LoadingButton
            fullWidth
            size="large"
            onClick={onSubmissionClicked}
            loading={formStatus === FORM_STATUS.SUBMITTING}
            disabled={
              formStatus != FORM_STATUS.IN_PROGRESS ||
              currentUser.status != ASYNC_STATUS.SUCCEEDED
            }
            variant="outlined"
          >
            <span>Submit Request</span>
          </LoadingButton>
        )}
        {currentUser.status != ASYNC_STATUS.SUCCEEDED && (
          <Typography variant="caption" color="error">
            Please Log In Before Requesting
          </Typography>
        )}
      </Stack>

      {formStatus === FORM_STATUS.SUBMITTED && (
        <RequestReceiptModal input={formatInput(input)} />
      )}
    </Stack>
  );
};

export default RequestForm;
