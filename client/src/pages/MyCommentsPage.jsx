import { Box } from "@mui/system";
import { useState, useEffect } from "react";
import GeneralCommentList from "../components/course/GeneralCommentList";
import { Stack, CircularProgress, Typography } from "@mui/material";

function MyCommentsPage() {
  const [comments, setComments] = useState([
    {
      courseId: "e11111",
      semester: "Spring 2023",
      professor: "Sub",
      commentHeader: "Header",
      commentBody: "Body",
      tags: ["Sad"],
      textbook: false,
      rating: 1,
      displayName: "SuperMan",
      fileName: "test-1",
    },
  ]);
  const [loading, setLoading] = useState(true); // TODO: use this to show loading spinner
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/my_comments")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setComments(data);
          setSuccess(true);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ width: "90vw", maxWidth: "1000px" }}>
      <Typography variant="h4" textAlign="center" sx={{ marginBottom: 5 }}>
        My Comments
      </Typography>
      {loading && (
        <Stack
          spacing={2}
          sx={{ boxShadow: 2, padding: 5, borderRadius: 2 }}
          alignItems="center"
        >
          <Typography textAlign="center">Loading Comments</Typography>
          <CircularProgress />
        </Stack>
      )}
      {error && (
        <Box sx={{ boxShadow: 2, padding: 5, borderRadius: 2 }}>
          <Typography textAlign="center">
            Oops, comments failed to load.
          </Typography>
        </Box>
      )}
      {success && <GeneralCommentList receivedComments={comments} />}
    </Box>
  );
}

export default MyCommentsPage;
