import { useSelector } from "react-redux/es/hooks/useSelector";
import Comment from "./Comment";
import { ASYNC_STATUS } from "../../features/util";
import { Stack, Box, Typography, CircularProgress } from "@mui/material";

const CommentList = () => {
	const { status, comments, filteredComments, error } = useSelector(
		(store) => store.commentList
	);

	return (
		<Stack spacing={2}>
			{status === ASYNC_STATUS.LOADING && (
				<Stack
					spacing={2}
					sx={{ boxShadow: 2, padding: 5, borderRadius: 2 }}
					alignItems="center"
				>
					<Typography textAlign="center">Loading Comments</Typography>
					<CircularProgress />
				</Stack>
			)}

			{status === ASYNC_STATUS.SUCCEEDED && !comments.length && (
				<Box sx={{ boxShadow: 2, padding: 5, borderRadius: 2 }}>
					<Typography textAlign="center">
						No comments for this class yet. Be the first to comment!
					</Typography>
				</Box>
			)}

			{status === ASYNC_STATUS.SUCCEEDED &&
				(filteredComments.length
					? filteredComments.map((comment, i) => (
							<Comment key={i} comment={comment} />
					  ))
					: comments.map((comment, i) => (
							<Comment key={i} comment={comment} />
					  )))}

			{status === ASYNC_STATUS.FAILED && (
				<Box sx={{ boxShadow: 2, padding: 5, borderRadius: 2 }}>
					<Typography textAlign="center">
						Oops, comments failed to load. Error message: {error}
					</Typography>
				</Box>
			)}
		</Stack>
	);
};

export default CommentList;
