import Box from "@mui/material/Box";
import { useSelector } from "react-redux/es/hooks/useSelector";
import CommentList from "./CommentList";
import CourseInfo from "./CourseInfo";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchComments } from "../../features/comments";

const Course = () => {
  const courseNumber = useParams().id;
  const dispatch = useDispatch();
  const { electives } = useSelector((store) => store.electiveList);
  const elective = electives.filter(
    (elective) => elective.courseNumber === courseNumber
  )[0];
  const courseId = elective.doc_id;

  useEffect(() => {
    dispatch(fetchComments(courseId));
  }, [courseNumber]);

  return (
    <Box sx={{ width: "90vw", maxWidth: "1000px" }}>
      <CourseInfo elective={elective} />
      <CommentList />
    </Box>
  );
};

export default Course;
