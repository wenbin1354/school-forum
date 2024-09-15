/* eslint-disable */
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

const Tag = ({ tag, count = 0 }) => {
  return (
    <Box
      sx={{
        padding: 1,
        backgroundColor: "#EAEAEA",
        margin: 1,
        borderRadius: "5px",
      }}
    >
      <Typography variant="caption">{tag}</Typography>
      {!!count && (
        <Box
          sx={{
            float: "right",
            marginLeft: 1,
            backgroundColor: "#C2C2C2",
            paddingX: 1,
            borderRadius: "5px",
          }}
        >
          <Typography variant="caption">{count}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Tag;
