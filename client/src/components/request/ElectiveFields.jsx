// disable elsint
/* eslint-disable */
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";

const ElectiveFields = (props) => {
  const { input, setInput, disabled, error } = props ?? {};
  const { majors } = useSelector((store) => store.majorList);
  const { electives } = useSelector((store) => store.electiveList);
  const [exampleCourseNumber, setExampleCourseNumber] = useState("");
  const [exampleCourseName, setExampleCourseName] = useState("");

  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * electives.length);
    setExampleCourseNumber(electives[randomIdx].courseNumber);
    setExampleCourseName(electives[randomIdx].courseName);
  }, [input.requestOption]);
  return (
    <>
      {/* Disallow spaces */}
      <TextField
        required
        fullWidth
        label="Course Number"
        autoComplete="off"
        disabled={disabled}
        error={!!error.courseNumber}
        helperText={`${
          error.courseNumber ? error.courseNumber : ""
        }e.g. ${exampleCourseNumber}`}
        value={input.courseNumber ? input.courseNumber : ""}
        onChange={(val) =>
          setInput({
            ...input,
            courseNumber: val.target.value.replace(/\s/g, ""),
          })
        }
      />
      <TextField
        required
        fullWidth
        label="Course Name"
        autoComplete="off"
        value={input.courseName}
        disabled={disabled}
        error={!!error.courseName}
        helperText={`${
          error.courseName ? error.courseName : ""
        }e.g. ${exampleCourseName}`}
        onChange={(val) => setInput({ ...input, courseName: val.target.value })}
      />
      <Autocomplete
        multiple
        fullWidth
        options={majors}
        getOptionLabel={(major) => major.majorName}
        filterSelectedOptions
        disabled={disabled}
        onChange={(_, val) =>
          setInput({
            ...input,
            courseMajor: val.map((major) => major),
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Course's Major(s)"
            error={!!error.courseMajor}
            helperText={error.courseMajor}
          />
        )}
      />
    </>
  );
};

export default ElectiveFields;
