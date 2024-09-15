/* eslint-disable */
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  MenuItem,
  Stack,
  TextField,
  Autocomplete,
  Typography,
  Rating,
  Button,
  Modal,
} from "@mui/material";
import { useState, useEffect } from "react";
import { FORM_STATUS, inputStackStyle, getRatingColor } from "../util";
import StyleIcon from "@mui/icons-material/Style";
import { useSelector } from "react-redux/es/hooks/useSelector";
import StyleOutlinedIcon from "@mui/icons-material/StyleOutlined";
import { tags } from "./tags";
import { inputOptions, verifyInputs } from "./util";
import Comment from "../course/Comment";
import { ASYNC_STATUS } from "../../features/util";
import { useLocation } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 600,
  width: "90vw",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 10,
  p: 4,
};

const Rate = () => {
  const loggedOutName = "Invalid";
  const currentUser = useSelector((store) => store.currentUser);
  const location = useLocation();
  const id = location.state?.courseId || "";
  const [input, setInput] = useState({
    courseId: id,
    displayName: "",
    semesterYear: new Date().getFullYear(),
    semesterSeason: "",
    professor: "",
    rating: 0,
    textbook: "",
    attendance: "",
    grade: "",
    tags: [],
    commentHeader: "",
    commentBody: "",
    file: null,
  });

  useEffect(() => {
    if (currentUser.status === ASYNC_STATUS.SUCCEEDED) {
      setDisplayNameOptions([
        {
          label: currentUser.user.displayName,
          value: currentUser.user.displayName,
        },
        { label: "Anonymous", value: "Anonymous" },
      ]);
      setInput({ ...input, displayName: currentUser.user.displayName });
    } else {
      setDisplayNameOptions([
        {
          label: loggedOutName,
          value: loggedOutName,
        },
        { label: "Anonymous", value: "Anonymous" },
      ]);
      setInput({ ...input, displayName: loggedOutName });
    }
  }, [currentUser.status]);

  const [formattedInput, setFormattedInput] = useState();
  const [preview, setPreview] = useState(false);
  const [formStatus, setFormStatus] = useState(FORM_STATUS.IN_PROGRESS);
  const [inputError, setInputError] = useState({});
  const { electives } = useSelector((store) => store.electiveList);
  const [ratingHoverColor, setRatingHoverColor] = useState(undefined);
  const [submitCommentError, setSubmitCommentError] = useState("");

  const { seasonOptions, textbookOptions, attendanceOptions, gradeOptions } =
    inputOptions;
  const [displayNameOptions, setDisplayNameOptions] = useState([]);

  useEffect(() => {
    if (!preview) {
      setFormattedInput();
      setSubmitCommentError("");
    }
  }, [preview]);

  const reviewInputs = () => {
    setInputError({});
    const verificationResult = verifyInputs(
      input,
      electives.map((elective) => elective.doc_id)
    );

    if (Object.keys(verificationResult.error).length) {
      setInputError(verificationResult.error);
      return;
    }
    setFormattedInput(verificationResult.formattedInput);
    setPreview(true);
  };

  const onSubmissionClicked = () => {
    setFormStatus(FORM_STATUS.SUBMITTING);
    const formData = new FormData();
    formData.append("file", formattedInput.file);

    // Stringify and append other fields as a JSON string
    const nonFileFields = { ...formattedInput };
    delete nonFileFields.file; // Remove the file field from nonFileFields
    formData.append("data", JSON.stringify(nonFileFields));

    // post /api/create_comment with form data
    fetch("/api/create_comment", {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((response) => {
        if (response.status === 403)
          throw new Error("Please log in before commenting");
        return response.json();
      })
      .then((data) => {
        setFormStatus(FORM_STATUS.SUBMITTED);
      })
      .catch((err) => {
        setSubmitCommentError(err.message);
        setFormStatus(FORM_STATUS.IN_PROGRESS);
      });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      // Check if the file size is less than 1MB
      if (selectedFile.size <= 1024 * 1024) {
        setInput({ ...input, file: selectedFile });
      } else {
        alert("File size exceeds 1MB. Please select a smaller file.");
        // Optionally, you can clear the file input
        e.target.value = null;
      }
    }
  };

  return (
    <>
      <Box width="90vw" maxWidth={600}>
        <Stack direction="column" spacing={3}>
          <Stack alignItems="center">
            <Typography sx={{ fontSize: 30 }} textAlign="center" variant="h4">
              COMMENT
            </Typography>
            {currentUser.status != ASYNC_STATUS.SUCCEEDED && (
              <Typography variant="caption" color="error">
                Please log in before commenting
              </Typography>
            )}
            {currentUser.status === ASYNC_STATUS.SUCCEEDED &&
              !currentUser.user.isVerified && (
                <>
                  <Typography variant="caption" color="error">
                    Please verify your email before commenting
                  </Typography>
                  <Typography variant="caption" color="error">
                    If you already verified, please refresh the page
                  </Typography>
                </>
              )}
          </Stack>

          <Stack spacing={2} sx={inputStackStyle} alignItems="center">
            <Typography textAlign="center" variant="button">
              Which class do you want to comment?
            </Typography>
            <Autocomplete
              sx={{ width: "inherit", minWidth: 250 }}
              options={electives}
              getOptionLabel={(option) =>
                option.courseNumber + " " + option.courseName
              }
              filterSelectedOptions
              disabled={formStatus != FORM_STATUS.IN_PROGRESS}
              onChange={(_, val) =>
                setInput({
                  ...input,
                  courseId: val ? val.doc_id : "",
                })
              }
              value={
                electives.find((option) => option.doc_id === input.courseId) ||
                null
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Elective"
                  error={!!inputError.courseId}
                  helperText={inputError.courseId}
                />
              )}
            />
          </Stack>

          <Stack spacing={2} sx={inputStackStyle} alignItems="center">
            <Typography textAlign="center" variant="button">
              Choose Display Name (Comment Anonymously)
            </Typography>
            <TextField
              sx={{ width: "300px" }}
              select
              label="Display Name"
              disabled={formStatus != FORM_STATUS.IN_PROGRESS}
              value={input.displayName}
              error={!!inputError.displayName}
              helperText={inputError.displayName}
              onChange={(val) =>
                setInput({
                  ...input,
                  displayName: val.target.value,
                })
              }
            >
              {displayNameOptions.map((displayNameOption, idx) => (
                <MenuItem key={idx} value={displayNameOption.value}>
                  {displayNameOption.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack spacing={2} sx={inputStackStyle}>
            <Typography textAlign="center" variant="button">
              Which semester did you take the class?
            </Typography>
            <Stack direction="row" justifyContent="space-around">
              <TextField
                required
                label="Year"
                type="number"
                sx={{ width: "40%" }}
                value={input.semesterYear}
                error={!!inputError.semesterYear}
                helperText={inputError.semesterYear}
                onChange={(val) =>
                  setInput({
                    ...input,
                    semesterYear: val.target.value,
                  })
                }
              />
              <TextField
                required
                sx={{ width: "40%" }}
                select
                label="Season"
                disabled={formStatus != FORM_STATUS.IN_PROGRESS}
                value={input.semesterSeason}
                error={!!inputError.semesterSeason}
                helperText={inputError.semesterSeason}
                onChange={(val) =>
                  setInput({
                    ...input,
                    semesterSeason: val.target.value,
                  })
                }
              >
                {seasonOptions.map((seasonOption) => (
                  <MenuItem key={seasonOption.value} value={seasonOption.value}>
                    {seasonOption.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </Stack>

          <Stack spacing={2} sx={inputStackStyle} alignItems="center">
            <Typography textAlign="center" variant="button">
              Who was the professor?
            </Typography>
            <TextField
              required
              autoComplete="off"
              sx={{ width: "300px" }}
              label="Professor"
              disabled={formStatus != FORM_STATUS.IN_PROGRESS}
              value={input.professor}
              error={!!inputError.professor}
              helperText={
                inputError.professor
                  ? `${inputError.professor} (Format: FirstName LastName) `
                  : "Format: FirstName LastName"
              }
              onChange={(val) =>
                setInput({
                  ...input,
                  professor: val.target.value,
                })
              }
            />
          </Stack>

          <Stack
            spacing={2}
            sx={inputStackStyle}
            alignItems="center"
            useFlexGap
            flexWrap="wrap"
          >
            <Typography textAlign="center" variant="button">
              Rate this class
            </Typography>
            <Stack spacing={1} width="175px" alignItems="center">
              <Rating
                sx={{
                  color: ratingHoverColor
                    ? ratingHoverColor
                    : getRatingColor(input.rating),
                }}
                value={input.rating}
                onChange={(_, value) => {
                  setInput({ ...input, rating: value });
                }}
                icon={<StyleIcon fontSize="large" />}
                emptyIcon={<StyleOutlinedIcon fontSize="large" />}
                onChangeActive={(_, newHoverVal) => {
                  if (newHoverVal >= 1 && newHoverVal <= 5) {
                    setRatingHoverColor(getRatingColor(newHoverVal));
                  } else {
                    setRatingHoverColor(undefined);
                  }
                }}
              />
              <Typography color="#D32F2F" variant="caption">
                {inputError.rating}
              </Typography>
            </Stack>
          </Stack>

          <Stack spacing={2} sx={inputStackStyle} alignItems="center">
            <Typography textAlign="center" variant="button">
              Was textbook required?
            </Typography>
            <TextField
              sx={{ width: "300px" }}
              select
              label="Textbook"
              disabled={formStatus != FORM_STATUS.IN_PROGRESS}
              value={input.textbook}
              error={!!inputError.textbook}
              helperText={inputError.textbook}
              onChange={(val) =>
                setInput({
                  ...input,
                  textbook: val.target.value,
                })
              }
            >
              {textbookOptions.map((textbookOption) => (
                <MenuItem
                  key={textbookOption.label}
                  value={textbookOption.value}
                >
                  {textbookOption.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack spacing={2} sx={inputStackStyle} alignItems="center">
            <Typography textAlign="center" variant="button">
              Was attendance required?
            </Typography>
            <TextField
              sx={{ width: "300px" }}
              select
              label="Attendance"
              disabled={formStatus != FORM_STATUS.IN_PROGRESS}
              value={input.attendance}
              error={!!inputError.attendance}
              helperText={inputError.attendance}
              onChange={(val) =>
                setInput({
                  ...input,
                  attendance: val.target.value,
                })
              }
            >
              {attendanceOptions.map((attendanceOption) => (
                <MenuItem
                  key={attendanceOption.label}
                  value={attendanceOption.value}
                >
                  {attendanceOption.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack spacing={2} sx={inputStackStyle} alignItems="center">
            <Typography textAlign="center" variant="button">
              What grade did you receive?
            </Typography>
            <TextField
              sx={{ width: "300px" }}
              select
              label="Grade Received"
              disabled={formStatus != FORM_STATUS.IN_PROGRESS}
              value={input.grade}
              error={!!inputError.grade}
              helperText={inputError.grade}
              onChange={(val) =>
                setInput({
                  ...input,
                  grade: val.target.value,
                })
              }
            >
              {gradeOptions.map((gradeOption) => (
                <MenuItem key={gradeOption.label} value={gradeOption.value}>
                  {gradeOption.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack spacing={2} sx={inputStackStyle} alignItems="center">
            <Typography textAlign="center" variant="button">
              Tags (Select up to 3)
            </Typography>
            <Stack
              direction="row"
              useFlexGap
              flexWrap="wrap"
              justifyContent="center"
            >
              {tags.map((tag) => {
                return (
                  <Box
                    sx={{
                      padding: 1,
                      backgroundColor: "#EAEAEA",
                      margin: 1,
                      borderRadius: "5px",
                      cursor:
                        input.tags.length === 3 && !input.tags.includes(tag)
                          ? "no-drop"
                          : "pointer",
                      border: input.tags.includes(tag) ? 3 : 0,
                      userSelect: "none",
                    }}
                    key={tag}
                    onClick={() => {
                      if (input.tags.length === 3 || input.tags.includes(tag)) {
                        setInput({
                          ...input,
                          tags: [...input.tags].filter(
                            (existingTag) => existingTag != tag
                          ),
                        });
                      } else {
                        setInput({
                          ...input,
                          tags: [...input.tags].concat(tag),
                        });
                      }
                    }}
                  >
                    <Typography variant="caption">{tag}</Typography>
                  </Box>
                );
              })}
            </Stack>
          </Stack>

          <Stack spacing={2} sx={inputStackStyle} alignItems="center">
            <Typography textAlign="center" variant="button">
              Comment Header
            </Typography>
            <TextField
              required
              autoComplete="off"
              sx={{ width: "300px" }}
              label="Header"
              disabled={formStatus != FORM_STATUS.IN_PROGRESS}
              value={input.commentHeader}
              error={!!inputError.commentHeader}
              helperText={inputError.commentHeader}
              onChange={(val) =>
                setInput({
                  ...input,
                  commentHeader: val.target.value,
                })
              }
            />
          </Stack>

          <Stack spacing={2} sx={inputStackStyle} alignItems="center">
            <Typography textAlign="center" variant="button">
              Comment Body
            </Typography>
            <TextField
              required
              sx={{ minWidth: "300px", width: "inherit" }}
              label="Comment"
              disabled={formStatus != FORM_STATUS.IN_PROGRESS}
              value={input.commentBody}
              error={!!inputError.commentBody}
              helperText={inputError.commentBody}
              multiline
              minRows={4}
              onChange={(val) =>
                setInput({
                  ...input,
                  commentBody: val.target.value,
                })
              }
            />
            <label htmlFor="fileInput">
              Upload an image (jpg, jpeg, png) less than 1MB:
            </label>
            <input
              type="file"
              accept=".jpg, .jpeg, .png"
              id="fileInput"
              onChange={(e) => handleFileChange(e)}
            />
          </Stack>

          <Button
            variant="outlined"
            onClick={() => reviewInputs()}
            disabled={!currentUser.user.isVerified}
          >
            Review
          </Button>
        </Stack>
      </Box>
      <Modal
        open={preview}
        onClose={() => {
          if (formStatus === FORM_STATUS.SUBMITTED) {
            window.location.reload();
          }
          setPreview(false);
        }}
      >
        <Stack spacing={4} sx={style} textAlign="center">
          <Typography variant="h4">
            Review Comment<Box sx={{ border: 0.5, marginTop: 1 }}></Box>
          </Typography>

          <Box textAlign="left">
            <Comment comment={formattedInput} preview={true} />
          </Box>

          <Stack spacing={1} textAlign="center">
            <LoadingButton
              size="large"
              onClick={onSubmissionClicked}
              loading={formStatus === FORM_STATUS.SUBMITTING}
              disabled={formStatus != FORM_STATUS.IN_PROGRESS}
              variant="outlined"
              color={!!submitCommentError ? "error" : "primary"}
            >
              <span>Submit Comment</span>
            </LoadingButton>
            {submitCommentError !== "" && (
              <Typography color="#D32F2F" variant="caption">
                {submitCommentError}
              </Typography>
            )}
            {formStatus === FORM_STATUS.SUBMITTED && (
              <Typography color="#2E7D32" variant="caption">
                Success. Thank you for your comment!
              </Typography>
            )}
          </Stack>
        </Stack>
      </Modal>
    </>
  );
};

export default Rate;
