import { trimAndCapitalize } from "../util";

const fields = {
  major: ["requestOption", "comment", "majorName"],
  elective: [
    "requestOption",
    "comment",
    "courseMajor",
    "courseName",
    "courseNumber",
  ],
};
export const formatInput = (input) => {
  const formattedInput = {
    submissionTime: Date.now(),
  };

  for (const field of fields[input.requestOption]) {
    formattedInput[field] = input[field];
  }

  if (input.requestOption === "major") {
    formattedInput.majorName = trimAndCapitalize(formattedInput.majorName);
  } else if (input.requestOption === "elective") {
    formattedInput.courseNumber = formattedInput.courseNumber.toUpperCase();
    formattedInput.courseName = trimAndCapitalize(formattedInput.courseName);
  }

  return formattedInput;
};

const verifyMajorInput = (input, majors) => {
  const inputError = {};
  if (!input.majorName.length) {
    // If major is empty string
    inputError.majorName = "Required, ";
  } else {
    // If major already exists
    if (
      majors
        .map((major) => trimAndCapitalize(major.majorName))
        .includes(input.majorName)
    ) {
      inputError.majorName = `Major "${input.majorName}" already exists!`;
    }
  }
  return inputError;
};

const verifyElectiveInput = (input, electives) => {
  const inputError = {};
  // Course Number
  if (!input.courseNumber.length) {
    // If course number is an empty string
    inputError.courseNumber = "Required, ";
  } else {
    // If course number is in the correct format
    if (!/\b[A-Z]+[0-9]+$\b/g.test(input.courseNumber)) {
      inputError.courseNumber = "Please enter a correct course number";
    }
  }

  // Elective Name
  if (!input.courseName.length) {
    inputError.courseName = "Required, ";
  }

  // Elective Major
  if (!input.courseMajor.length) {
    inputError.courseMajor =
      "The major this elective belongs to isn't here? Request major instead!";
  }

  // Repeated Elective Major
  const electivesWithSameCourseNumber = electives.filter(
    (elective) => elective.courseNumber === input.courseNumber
  );

  if (electivesWithSameCourseNumber.length) {
    const existingCourseMajor = electivesWithSameCourseNumber[0].major;
    const majorError = [];

    for (const inputMajor of input.courseMajor) {
      if (existingCourseMajor.includes(inputMajor.doc_id)) {
        majorError.push(inputMajor.majorName);
      }
    }

    if (majorError.length) {
      inputError.courseMajor = `${
        input.courseNumber
      } is already listed under "${majorError.join(
        ", "
      )}". Delete them from the list before proceeding`;
    }
  }

  return inputError;
};

export const verifyInput = (input, majors, electives) => {
  switch (input.requestOption) {
    case "major":
      return verifyMajorInput(input, majors);
    case "elective":
      return verifyElectiveInput(input, electives);
  }
};
