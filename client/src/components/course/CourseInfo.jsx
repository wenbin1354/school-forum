/* eslint-disable */

import { useSelector } from "react-redux/es/hooks/useSelector";
import {
	Typography,
	Box,
	Stack,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Button,
	Link,
} from "@mui/material";
import Tag from "./Tag";
import {
	getMostPopularTags,
	getAverageRating,
	getAverageGrade,
	getFilterOptions,
} from "./util";
import InfoBanner from "./InfoBanner";
import { useEffect, useState } from "react";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import { ASYNC_STATUS } from "../../features/util";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { filteredComments } from "../../features/comments";

const CourseInfo = ({ elective }) => {
	const commentList = useSelector((store) => store.commentList);
	const comments = commentList.comments;
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [mostPopularTags, setMostPopularTags] = useState([]);
	const [averageRating, setAverageRating] = useState(0);
	const [averageGrade, setAverageGrade] = useState("");
	const [filterOptions, setFilterOptions] = useState(["All Semesters"]);
	const [filter, setFilter] = useState(filterOptions[0]);

	useEffect(() => {
		if (commentList.status === ASYNC_STATUS.SUCCEEDED) {
			setMostPopularTags(getMostPopularTags(comments));
			setAverageRating(getAverageRating(comments));
			setAverageGrade(getAverageGrade(comments));
			setFilterOptions(getFilterOptions(comments));
		}
	}, [commentList]);

	const changeFilter = (filterOption) => {
		setFilter(filterOption);
		if (filterOption === "All Semesters") {
			dispatch(filteredComments([]));
			return;
		}
		const filteredCommentsArr = comments.filter(
			(comment) => comment.semester === filterOption
		);
		dispatch(filteredComments(filteredCommentsArr));
	};

	return (
		<>
			<Stack
				direction="row"
				justifyContent="space-between"
				useFlexGap
				flexWrap="wrap"
			>
				<Box sx={{ padding: 1, maxWidth: 500 }}>
					<Typography variant="h5" sx={{ fontWeight: "1000" }}>
						{elective.courseNumber}
					</Typography>
					<Typography variant="h2" sx={{ fontWeight: "1000" }}>
						{elective.courseName}
					</Typography>
					<Typography variant="caption">
						{" "}
						See on{" "}
						<Link href={elective.catalogLink} target="_blank">
							Hunter Catalog
						</Link>
					</Typography>
				</Box>
				{commentList.status === ASYNC_STATUS.SUCCEEDED && (
					<Box>
						<Stack direction="row" sx={{ padding: 1, maxWidth: 400 }}>
							<InfoBanner description="Total Ratings" value={comments.length} />
							<Box sx={{ border: 1 }}></Box>
							<InfoBanner
								description="Average Rating"
								value={averageRating === 0 ? "N/A" : averageRating + "/5"}
							/>
							<Box sx={{ border: 1 }}></Box>
							<InfoBanner
								description="Average Grade"
								value={
									averageGrade.letterAvg
										? averageGrade.letterAvg
										: `${averageGrade.lowerLetterAvg}, ${averageGrade.higherLetterAvg}`
								}
							/>
						</Stack>
						<Stack
							direction="row"
							justifyContent="center"
							useFlexGap
							flexWrap="wrap"
							maxWidth={400}
						>
							{mostPopularTags.map((tag, i) => {
								return <Tag key={i} tag={tag.str} count={tag.count} />;
							})}
						</Stack>
					</Box>
				)}
			</Stack>

			<Stack direction="row" justifyContent="space-between" sx={{ marginY: 3 }}>
				<FormControl sx={{ width: 200 }}>
					<InputLabel>Filter</InputLabel>
					<Select
						value={filter}
						label="Filter"
						onChange={(val) => changeFilter(val.target.value)}
						sx={{
							borderRadius: 10,
							textAlign: "center",
							backgroundColor: "#EAEAEA",
						}}
					>
						{filterOptions.map((filterOption) => {
							return (
								<MenuItem key={filterOption} value={filterOption}>
									{filterOption}
								</MenuItem>
							);
						})}
					</Select>
				</FormControl>
				<Button
					variant="outlined"
					sx={{
						borderColor: "black",
						borderRadius: 10,
						backgroundColor: "#EAEAEA",
						color: "black",
					}}
					onClick={() =>
						navigate("/rate", {
							replace: true,
							state: { courseId: elective.doc_id },
						})
					}
				>
					<CommentOutlinedIcon sx={{ marginRight: 1 }} /> Rate This Class
				</Button>
			</Stack>
			<Box sx={{ border: 1, marginY: 3, borderColor: "#EAEAEA" }}></Box>
		</>
	);
};

export default CourseInfo;
