import Box from "@mui/material/Box";
import { Typography, Stack } from "@mui/material";

const InfoBanner = ({ description, value, variant = "h4" }) => {
  return (
    <Box
      sx={{
        padding: 1,
        margin: 1,
        borderRadius: "5px",
      }}
    >
      <Stack direction="column">
        <Typography
          variant={variant}
          sx={{ fontWeight: "bold", textAlign: "center" }}
        >
          {value}
        </Typography>
        <Typography variant="caption" sx={{ textAlign: "center" }}>
          {description}
        </Typography>
      </Stack>
    </Box>
  );
};

export default InfoBanner;
