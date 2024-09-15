import {
  Button,
  TextField,
  Stack,
  ButtonGroup,
  Typography,
  Autocomplete,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { createMajor, createElective } from "../../api/api";
import { FORM_STATUS } from "../util";
import { verifyInput } from "./util";
import { useDispatch } from "react-redux";
import { addMajorTemplate, addElectiveTemplate } from "../../features/requests";

const RequestReceipt = ({ input, user, doc_id = "", editable = false }) => {
  const dispatch = useDispatch();
  const [newInput, setNewInput] = useState(input);
  const { majors } = useSelector((store) => store.majorList);
  const { electives } = useSelector((store) => store.electiveList);

  const [formStatus, setFormStatus] = useState(FORM_STATUS.IN_PROGRESS);
  const [inputError, setInputError] = useState({});
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (isVerified) {
      setIsVerified(false);
    }
  }, [newInput]);

  const onVerificationClicked = () => {
    setInputError({});
    let newInputError = verifyInput(newInput, majors, electives);
    if (newInput.catalogLink === "") {
      newInputError = { ...newInputError, catalogLink: "Required" };
    }

    if (Object.keys(newInputError).length) {
      setInputError(newInputError);
    } else {
      setIsVerified(true);
    }
  };

  const onSubmissionClicked = () => {
    // Lock inputs
    setFormStatus(FORM_STATUS.SUBMITTING);

    // Call API to /api/create_request
    let { requestOption, submissionTime, comment, ...apiInput } = newInput;

    switch (requestOption) {
      case "major":
        createMajor(apiInput).then(() => {
          setFormStatus(FORM_STATUS.SUBMITTED);
        });
        break;
      case "elective":
        apiInput.major = apiInput.courseMajor.map((major) => major.doc_id);
        delete apiInput.courseMajor;
        const courseWithSameCourseNumber = electives.filter(
          (elective) => elective.courseNumber === newInput.courseNumber
        );

        if (!courseWithSameCourseNumber.length) {
          createElective(apiInput).then(() => {
            setFormStatus(FORM_STATUS.SUBMITTED);
          });
        } else {
          fetch(`/api/add_major/${courseWithSameCourseNumber[0].doc_id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ major: apiInput.major }),
          }).then(() => {
            setFormStatus(FORM_STATUS.SUBMITTED);
          });
        }
        break;
      default:
        return;
    }
    if (user.email === "Request Template") {
      switch (requestOption) {
        case "major":
          dispatch(addMajorTemplate());
          break;
        case "elective":
          dispatch(addElectiveTemplate());
          break;
        default:
          break;
      }
    } else {
      fetch(`/api/delete_request/${doc_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  };

  const getDate = (dateInt) => {
    const date = new Date(parseInt(dateInt)).toDateString();
    return date;
  };

  return (
    <Stack
      sx={{
        width: 400,
        padding: 4,
        borderRadius: 2,
        bgcolor: "background.paper",
        boxShadow: 10,
      }}
      spacing={1}
    >
      <Typography variant="h5">
        {input.requestOption.charAt(0).toUpperCase() +
          input.requestOption.substr(1)}{" "}
        Request Receipt
      </Typography>
      <hr></hr>
      {input.requestOption === "major" && (
        <Stack direction="row" alignItems="center">
          <Typography sx={{ marginRight: 1 }}>Major Name:</Typography>
          {editable ? (
            <TextField
              required
              value={newInput.majorName}
              onChange={(val) =>
                setNewInput({ ...newInput, majorName: val.target.value })
              }
              disabled={formStatus != FORM_STATUS.IN_PROGRESS}
              error={!!inputError.majorName}
              autoComplete="off"
              helperText={inputError.majorName}
            />
          ) : (
            <Typography>{input.majorName}</Typography>
          )}
        </Stack>
      )}
      {input.requestOption === "elective" && (
        <>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ marginRight: 1 }}>Course Number:</Typography>
            {editable ? (
              <TextField
                required
                value={newInput.courseNumber}
                onChange={(val) =>
                  setNewInput({ ...newInput, courseNumber: val.target.value })
                }
                disabled={formStatus != FORM_STATUS.IN_PROGRESS}
                error={!!inputError.courseNumber}
                autoComplete="off"
                helperText={inputError.courseNumber}
              />
            ) : (
              <Typography>{input.courseNumber}</Typography>
            )}
          </Stack>

          <Stack direction="row" alignItems="center">
            <Typography sx={{ marginRight: 1 }}>Course Name:</Typography>
            {editable ? (
              <TextField
                required
                value={newInput.courseName}
                onChange={(val) =>
                  setNewInput({ ...newInput, courseName: val.target.value })
                }
                disabled={formStatus != FORM_STATUS.IN_PROGRESS}
                error={!!inputError.courseName}
                autoComplete="off"
                helperText={inputError.courseName}
              />
            ) : (
              <Typography>{input.courseName}</Typography>
            )}
          </Stack>

          <Stack direction="row" alignItems="center">
            <Typography sx={{ marginRight: 1 }}>
              Course&apos;s Major:
            </Typography>
            {editable ? (
              <Autocomplete
                multiple
                fullWidth
                disabled={formStatus != FORM_STATUS.IN_PROGRESS}
                options={majors}
                getOptionLabel={(major) => major.majorName}
                defaultValue={input.courseMajor}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) =>
                  option.doc_id === value.doc_id
                }
                onChange={(_, val) =>
                  setNewInput({
                    ...newInput,
                    courseMajor: val.map((major) => major),
                  })
                }
                renderInput={(params) => (
                  <TextField
                    error={!!inputError.courseMajor}
                    helperText={inputError.courseMajor}
                    {...params}
                  />
                )}
              />
            ) : (
              <Typography>
                {input.courseMajor.map((major) => major.majorName).join(", ")}
              </Typography>
            )}
          </Stack>
          {editable && (
            <Stack direction="row" alignItems="center">
              <Typography sx={{ marginRight: 1 }}>
                Hunter Catalog Link:
              </Typography>
              <TextField
                required
                value={newInput.catalogLink}
                onChange={(val) =>
                  setNewInput({ ...newInput, catalogLink: val.target.value })
                }
                disabled={formStatus != FORM_STATUS.IN_PROGRESS}
                error={!!inputError.catalogLink}
                autoComplete="off"
                helperText={inputError.catalogLink}
              />
            </Stack>
          )}
        </>
      )}
      {input.comment && input.comment.length > 0 && (
        <Typography>Additional Comments: {input.comment}</Typography>
      )}

      <hr></hr>
      <Typography sx={{ mt: 2 }}>Submitted by {user.email}</Typography>
      <Typography>Submission Time: {getDate(input.submissionTime)}</Typography>
      {editable &&
        (formStatus === FORM_STATUS.SUBMITTED ? (
          <Typography color="#2E7D32" textAlign="center">
            Success
          </Typography>
        ) : (
          <Stack alignItems="center">
            <ButtonGroup variant="contained">
              <Button onClick={onVerificationClicked}>Verify</Button>
              <Button onClick={onSubmissionClicked} disabled={!isVerified}>
                Create{" "}
                {input.requestOption.charAt(0).toUpperCase() +
                  input.requestOption.substr(1)}{" "}
              </Button>
            </ButtonGroup>
          </Stack>
        ))}
    </Stack>
  );
};

export default RequestReceipt;
