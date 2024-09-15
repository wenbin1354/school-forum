import { Stack, Typography, Box, Badge } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import RequestReceipt from "./RequestReceipt";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

const ViewRequest = () => {
  const requestList = useSelector((store) => store.requestList);
  const [value, setValue] = useState("1");

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };
  const requestLength = {
    major:
      requestList.major &&
      requestList.major.filter(
        (request) => request.user.email !== "Request Template"
      ).length,
    elective:
      requestList.elective &&
      requestList.elective.filter(
        (request) => request.user.email !== "Request Template"
      ).length,
  };

  return (
    <Box sx={{ typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange}>
            <Tab
              label={
                <Badge badgeContent={requestLength.major} color="error">
                  <Typography sx={{ marginRight: 0.5 }}>Major</Typography>
                </Badge>
              }
              value="1"
            />
            <Tab
              label={
                <Badge badgeContent={requestLength.elective} color="error">
                  <Typography sx={{ marginRight: 0.5 }}>Elective</Typography>
                </Badge>
              }
              value="2"
            />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Stack
            direction="row"
            useFlexGap
            flexWrap="wrap"
            spacing={2}
            margin={1}
            justifyContent="center"
          >
            {requestList.major &&
              requestList.major.length &&
              requestList.major.map((request, i) => (
                <RequestReceipt
                  key={i}
                  input={request.input}
                  user={request.user}
                  doc_id={request.doc_id}
                  editable={true}
                />
              ))}
          </Stack>
        </TabPanel>
        <TabPanel value="2">
          <Stack
            direction="row"
            useFlexGap
            flexWrap="wrap"
            spacing={2}
            margin={1}
            justifyContent="center"
          >
            {requestList.elective &&
              requestList.elective.length &&
              requestList.elective.map((request, i) => (
                <RequestReceipt
                  key={i}
                  input={request.input}
                  user={request.user}
                  doc_id={request.doc_id}
                  editable={true}
                />
              ))}
          </Stack>
        </TabPanel>
      </TabContext>
    </Box>
  );
};
export default ViewRequest;
