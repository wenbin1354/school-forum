export const FORM_STATUS = {
  IN_PROGRESS: 1,
  SUBMITTING: 2,
  SUBMITTED: 3,
};

export const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 500,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 10,
  padding: 6,
};

export const inputStackStyle = {
  border: 1,
  borderColor: "grey.500",
  padding: 5,
  borderRadius: 2,
  boxShadow: 2,
};

export const getRatingColor = (rating) => {
  switch (rating) {
    case 1:
      return "rgba(235, 87, 87, 0.7)";
    case 2:
      return "rgba(242, 153, 74, 0.7)";
    case 3:
      return "rgba(242, 201, 76, 0.7)";
    case 4:
      return "rgba(142, 207, 111, 0.7)";
    case 5:
      return "rgba(33, 150, 83, 0.7)";
    default:
      return "rgb(189, 189, 189)";
  }
};

export const gradeScale = [
  { letter: "A+", number: [97.5, 100] },
  { letter: "A", number: [92.5, 97.4] },
  { letter: "A-", number: [90, 92.4] },
  { letter: "B+", number: [87.5, 89.9] },
  { letter: "B", number: [82.5, 87.4] },
  { letter: "B-", number: [80, 82.4] },
  { letter: "C+", number: [77.5, 79.9] },
  { letter: "C", number: [70.0, 77.4] },
  { letter: "D", number: [60, 69.9] },
  { letter: "F", number: [0, 59.9] },
];

export const trimAndCapitalize = (string) => {
  return string
    .toLowerCase()
    .split(" ")
    .filter((i) => i.length > 0)
    .map((i) => i.charAt(0).toUpperCase() + i.substr(1))
    .join(" ");
};
