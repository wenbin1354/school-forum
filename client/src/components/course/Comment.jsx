// disable eslint for this file
/* eslint-disable */

import { Box, IconButton, Stack, Typography } from "@mui/material";
import StyleIcon from "@mui/icons-material/Style";
import StyleOutlinedIcon from "@mui/icons-material/StyleOutlined";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux";
import { updateCurrentUser } from "../../features/user";

import Tag from "./Tag";
import ImageComponent from "./Image";
import ConfirmationModal from "../Confirmation";
import { getRatingColor } from "../util";

const useDebounce = (func, delay, dependencies) => {
  const timeoutRef = useRef(null);
  const prevDependenciesRef = useRef(dependencies);

  useEffect(() => {
    prevDependenciesRef.current = dependencies;
  }, dependencies);

  return (...args) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (
        dependencies.every(
          (dep, index) => dep === prevDependenciesRef.current[index]
        )
      ) {
        func(...args);
      }
    }, delay);
  };
};

const Comment = ({ comment, preview = false, deletable = false }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const currentUser = useSelector((store) => store.currentUser);
  const [upvotes, setUpvotes] = useState(comment.upvotes ?? 0);
  const [downvotes, setDownvotes] = useState(comment.downvotes ?? 0);
  const [agreedComments, setAgreedComments] = useState(
    currentUser.user.agreedComments ?? []
  );
  const [disagreedComments, setDisagreedComments] = useState(
    currentUser.user.disagreedComments ?? []
  );
  const [hasUpvoted, setHasUpvoted] = useState(
    agreedComments.includes(comment.doc_id)
  );
  const [hasDownvoted, setHasDownvoted] = useState(
    disagreedComments.includes(comment.doc_id)
  );

  const prevVoteActionAgreeRef = useRef(null);
  const prevVoteActionDisagreeRef = useRef(null);

  useEffect(() => {
    setHasUpvoted(agreedComments.includes(comment.doc_id));
    setHasDownvoted(disagreedComments.includes(comment.doc_id));
  }, [agreedComments, disagreedComments]);

  const debouncedApiCallAgree = useDebounce(
    (voteAction) => {
      if (voteAction !== prevVoteActionAgreeRef.current) {
        fetch(`/api/${comment.doc_id}/vote`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            voteAction: voteAction,
            voteType: "agree",
          }),
        }).then((res) => res.json());

        prevVoteActionAgreeRef.current = voteAction;
      }
    },
    10000,
    [prevVoteActionAgreeRef.current]
  );

  const debouncedApiCallDisagree = useDebounce(
    (voteAction) => {
      if (voteAction !== prevVoteActionDisagreeRef.current) {
        fetch(`/api/${comment.doc_id}/vote`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            voteAction: voteAction,
            voteType: "disagree",
          }),
        }).then((res) => res.json());

        prevVoteActionDisagreeRef.current = voteAction;
      }
    },
    10000,
    [prevVoteActionDisagreeRef.current]
  );

  const handleUpvote = () => {
    const voteAction = hasUpvoted ? "undo" : "increment";
    if (voteAction === "increment") {
      setUpvotes(upvotes + 1);
      setAgreedComments([...agreedComments, comment.doc_id]);
      dispatch(
        updateCurrentUser({
          ...currentUser.user,
          agreedComments: [...agreedComments, comment.doc_id],
        })
      );
    } else {
      setUpvotes(upvotes - 1);
      setAgreedComments(agreedComments.filter((id) => id !== comment.doc_id));
      dispatch(
        updateCurrentUser({
          ...currentUser.user,
          agreedComments: agreedComments.filter((id) => id !== comment.doc_id),
        })
      );
    }

    debouncedApiCallAgree(voteAction);
  };

  const handleDownvote = () => {
    const voteAction = hasDownvoted ? "undo" : "increment";
    if (voteAction === "increment") {
      setDownvotes(downvotes + 1);
      setDisagreedComments([...disagreedComments, comment.doc_id]);
      dispatch(
        updateCurrentUser({
          ...currentUser.user,
          disagreedComments: [...disagreedComments, comment.doc_id],
        })
      );
    } else {
      setDownvotes(downvotes - 1);
      setDisagreedComments(
        disagreedComments.filter((id) => id !== comment.doc_id)
      );
      dispatch(
        updateCurrentUser({
          ...currentUser.user,
          disagreedComments: disagreedComments.filter(
            (id) => id !== comment.doc_id
          ),
        })
      );
    }

    debouncedApiCallDisagree(voteAction);
  };

  const handleDelete = () => {
    // call /api/delete_comment/<str:comment_id>
    fetch(`/api/delete_comment/${comment.doc_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    //  refresh page
    window.location.reload();
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ boxShadow: 2, padding: 3.5, borderRadius: 2 }}>
      {deletable && (
        <IconButton
          sx={{ float: "right", marginLeft: 1, marginTop: -1 }}
          onClick={() => setOpen(true)}
        >
          <DeleteIcon />
        </IconButton>
      )}
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          useFlexGap
          flexWrap="wrap"
        >
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              {comment.professor} • {comment.semester}
            </Typography>
            {typeof comment.attendance === "boolean" && (
              <Typography variant="caption">
                Attendance:{" "}
                {comment.attendance ? "Mandatory, " : "Not mandatory, "}
              </Typography>
            )}
            {typeof comment.textbook === "boolean" && (
              <Typography variant="caption">
                Textbook: {comment.textbook ? "Required" : "Not required"}
              </Typography>
            )}
          </Box>
          <Box>
            <Typography variant="subtitle2">{comment.displayName}</Typography>
            {typeof comment.grade === "string" && (
              <Typography variant="caption">Grade: {comment.grade}</Typography>
            )}
          </Box>
        </Stack>
        <Box>
          {[...Array(comment.rating)].map((_, i) => {
            return (
              <StyleIcon
                key={i}
                sx={{ float: "left", color: getRatingColor(comment.rating) }}
              />
            );
          })}
          {[...Array(5 - comment.rating)].map((_, i) => {
            return <StyleOutlinedIcon key={i} sx={{ float: "left" }} />;
          })}
          <Typography
            variant="body2"
            sx={{
              fontWeight: "bold",
              float: "left",
              paddingX: 0.5,
              paddingY: 0.3,
            }}
          >
            {comment.commentHeader}
          </Typography>
        </Box>
        <Typography variant="body2">{comment.commentBody}</Typography>
        {!preview ? (
          <>{comment.fileUrl && <ImageComponent fileUrl={comment.fileUrl} />}</>
        ) : (
          <>
            {comment.file && (
              <ImageComponent fileUrl={URL.createObjectURL(comment.file)} />
            )}
          </>
        )}
        <Stack direction="row">
          {comment.tags.map((tag, i) => {
            return <Tag key={i} tag={tag}></Tag>;
          })}
        </Stack>

        <Stack direction="row">
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              onClick={handleUpvote}
              disabled={!currentUser.user?.isVerified ?? true}
            >
              {hasUpvoted ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
            </IconButton>
            <Typography variant="body2">{upvotes ?? 0}</Typography>
          </Stack>
          <Box sx={{ marginX: "10px" }}></Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              onClick={handleDownvote}
              disabled={!currentUser.user?.isVerified ?? true}
            >
              {hasDownvoted ? <ThumbDownAltIcon /> : <ThumbDownOffAltIcon />}
            </IconButton>
            <Typography variant="body2">{downvotes ?? 0}</Typography>
          </Stack>
        </Stack>
      </Stack>
      <ConfirmationModal
        open={open}
        onClose={handleClose}
        onConfirm={handleDelete}
      />
    </Box>
  );
};

export default Comment;
