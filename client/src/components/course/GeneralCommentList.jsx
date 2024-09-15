import Comment from "./Comment";
import { Stack, Box, Typography } from "@mui/material";

// eslint-disable-next-line react/prop-types
function GeneralCommentList({ receivedComments }) {
	const comments = receivedComments ?? [];
	return (
		<Stack spacing={2}>
			{!comments.length && (
				<Box sx={{ boxShadow: 2, padding: 5, borderRadius: 2 }}>
					<Typography textAlign="center">
						You have not commented on any classes yet.
					</Typography>
				</Box>
			)}

			{comments.length
				? comments.map((comment, i) => <Comment key={i} comment={comment} deletable={true} />)
				: comments.map((comment, i) => <Comment key={i} comment={comment} deletable={true}/>)}
		</Stack>
	);
}

export default GeneralCommentList;
