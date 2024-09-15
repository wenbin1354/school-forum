import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";

const MajorFields = (props) => {
  const { input, setInput, disabled, error } = props ?? {};
  const { majors } = useSelector((store) => store.majorList);
  const [exampleMajorName, setExampleMajorName] = useState("");

  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * majors.length);
    setExampleMajorName(majors[randomIdx].majorName);
  }, [input.requestOption]);

  return (
    <TextField
      required
      fullWidth
      label="Major Name"
      autoComplete="off"
      disabled={disabled}
      error={!!error.majorName}
      helperText={`${
        error.majorName ? error.majorName : ""
      } (e.g. ${exampleMajorName})`}
      onChange={(val) => setInput({ ...input, majorName: val.target.value })}
    />
  );
};

export default MajorFields;
