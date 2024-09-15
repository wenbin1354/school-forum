export const getApi = {
  electives: "/api/electives",
  majors: "/api/majors",
  comments: "/api/comments",
  user: "/api/user",
  admin: "/api/superuser",
  requests: "/api/pending_requests",
};

export const postApiUrl = {
  createComment: "/api/create_comment",
  createRequest: "/api/create_request",
  createMajor: "/api/create_major",
  createElective: "/api/create_elective",
};

export const patchApiUrl = {
  updateComment: "/api/:commentId/vote",
};

export const voteComment = (commentId, vote) => {
  return fetch(patchApiUrl.updateComment.replace(":commentId", commentId), {
    method: "PATCH",
    body: JSON.stringify({ vote }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    credentials: "include",
  }).then((response) => {
    if (response.status === 403) throw new Error("Please log in before voting");
    return response.json();
  });
};

export const createComment = (comment) => {
  return fetch(postApiUrl.createComment, {
    method: "POST",
    body: comment,
    credentials: "include",
  }).then((response) => {
    if (response.status === 403)
      throw new Error("Please log in before commenting");
    return response.json();
  });
};

export const createRequest = (request) => {
  return fetch(postApiUrl.createRequest, {
    method: "POST",
    body: JSON.stringify(request),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    credentials: "include",
  }).then((response) => {
    if (response.status === 403)
      throw new Error("Please log in before requesting");
    return response.json();
  });
};

export const createMajor = (major) => {
  return fetch(postApiUrl.createMajor, {
    method: "POST",
    body: JSON.stringify(major),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    credentials: "include",
  });
};

export const createElective = (elective) => {
  return fetch(postApiUrl.createElective, {
    method: "POST",
    body: JSON.stringify(elective),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    credentials: "include",
  });
};
