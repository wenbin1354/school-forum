import { gradeScale } from "../util";

export const inputOptions = {
  seasonOptions: [
    { label: "Spring", value: "Spring" },
    { label: "Summer", value: "Summer" },
    { label: "Fall", value: "Fall" },
    { label: "Winter", value: "Winter" },
  ],
  textbookOptions: [
    { label: "Required", value: "required" },
    { label: "Not required", value: "not required" },
    { label: "Don't Remember", value: "do not remember" },
  ],
  attendanceOptions: [
    { label: "Required", value: "required" },
    { label: "Not required", value: "not required" },
    { label: "Don't Remember", value: "do not remember" },
  ],
  gradeOptions: [
    { label: "Prefer Not to Say", value: "prefer not to say" },
  ].concat(
    gradeScale.map((grade) => {
      return { label: grade.letter, value: grade.letter };
    })
  ),
};

export const verifyInputs = (input, existingElectiveIds) => {
  // returns formattedObj and errorObj
  let errorObj = {};
  // Check required fields
  const requiredKeys = [
    "courseId",
    "semesterYear",
    "semesterSeason",
    "professor",
    "rating",
    "commentHeader",
    "commentBody",
  ];

  for (const requiredKey of requiredKeys) {
    if (input[requiredKey] === "" || input[requiredKey] === 0) {
      errorObj[requiredKey] = "Required";
    }
  }
  if (Object.keys(errorObj).length) {
    return { formattedInput: {}, error: errorObj };
  }

  // Format inputs
  const formattedInput = formatInputs(input);

  // Verify inputs
  if (!existingElectiveIds.includes(formattedInput.courseId)) {
    // This should not happen
    errorObj.courseId = "Invalid Course ID";
  }

  if (
    formattedInput.semesterYear < 2010 ||
    formattedInput.semesterYear > new Date().getFullYear()
  ) {
    errorObj.semesterYear = "Invalid Year";
  }

  // Wrap up
  const { semesterYear, semesterSeason, ...returnInput } = formattedInput;

  return { formattedInput: returnInput, error: errorObj };
};

const formatInputs = (input) => {
  let { professor, textbook, attendance, grade, ...formattedInput } = input;
  formattedInput.semester = `${input.semesterYear} ${input.semesterSeason}`;
  formattedInput.professor = professor
    .toLowerCase()
    .split(" ")
    .filter((i) => i.length > 0)
    .map((i) => i.charAt(0).toUpperCase() + i.substr(1))
    .join(" ");

  if (formattedInput.textbook === "do not remember") {
    formattedInput.textbook = "";
  }

  switch (textbook) {
    case "required":
      formattedInput.textbook = true;
      break;
    case "not required":
      formattedInput.textbook = false;
      break;
  }

  switch (attendance) {
    case "required":
      formattedInput.attendance = true;
      break;
    case "not required":
      formattedInput.attendance = false;
      break;
  }

  if (grade != "prefer not to say" && grade != "") {
    formattedInput.grade = grade;
  }

  return formattedInput;
};
