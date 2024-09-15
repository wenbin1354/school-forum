import { formatInput, verifyInput } from "./util";

describe("formatInput", () => {
  it("[MAJOR REQUEST] capitalizes and trim major name", () => {
    const input = { requestOption: "major", majorName: " computer   scieNCE" };
    const expectedFormattedMajorName = "Computer Science";
    expect(formatInput(input).majorName).toBe(expectedFormattedMajorName);
  });
  it("[ELECTIVE REQUEST] capitalizes and trim course name & convert course number to upper case", () => {
    const input = {
      requestOption: "elective",
      courseName: "   eLECTiVe coUrse",
      courseNumber: "elec101",
    };
    const expectedFormattedCourseName = "Elective Course";
    const expectedFormattedCourseNumber = "ELEC101"; // trim is handled in the input

    const formatResult = formatInput(input);
    expect(formatResult.courseName).toBe(expectedFormattedCourseName);
    expect(formatResult.courseNumber).toBe(expectedFormattedCourseNumber);
  });
});

describe("[MAJOR REQUEST] verifyInput", () => {
  // These are the keys that will be used to verify
  const majors = [{ majorName: "Major One" }, { majorName: "Major Two" }];
  const electives = [{ courseNumber: "ELEC101", major: ["m11111", "m11112"] }];
  let input;
  beforeEach(() => {
    input = {
      requestOption: "major",
      comment: "",
      majorName: "Major Three",
      submissionTime: 10000,
    };
  });
  it("requesting an unlisted major will not return error", () => {
    expect(verifyInput(input, majors, electives)).toStrictEqual({});
  });
  it("requesting an listed major will return error", () => {
    input.majorName = "Major Two";
    expect(verifyInput(input, majors, electives)).toStrictEqual({
      majorName: 'Major "Major Two" already exists!',
    });
  });
  it("requesting without majorName will return error", () => {
    input.majorName = "";
    expect(verifyInput(input, majors, electives)).toStrictEqual({
      majorName: "Required, ",
    });
  });
});

describe("[ELECTIVE REQUEST] verifyInput", () => {
  // These are the keys that will be used to verify
  const majors = [{ majorName: "Major One" }];
  const electives = [{ courseNumber: "ELEC101", major: ["m11111", "m11112"] }];
  const requiredFields = ["courseMajor", "courseName", "courseNumber"];
  let input;
  beforeEach(() => {
    input = {
      comment: "",
      courseMajor: [{ doc_id: "m11111", majorName: "Major One" }],
      courseName: "Elective 102",
      courseNumber: "ELEC102",
      requestOption: "elective",
      submissionTime: 10000,
    };
  });
  it("requesting without required fields will return error", () => {
    const expectedError = {};

    input.courseMajor = [];
    expectedError.courseMajor =
      "The major this elective belongs to isn't here? Request major instead!";
    expect(verifyInput(input, majors, electives)).toStrictEqual(expectedError);

    input.courseName = "";
    expectedError.courseName = "Required, ";
    expect(verifyInput(input, majors, electives)).toStrictEqual(expectedError);

    input.courseNumber = "";
    expectedError.courseNumber = "Required, ";
    expect(verifyInput(input, majors, electives)).toStrictEqual(expectedError);
  });
  it("invalid course number format will return error", () => {
    // valid course number is [A-Z]+[0-9]+
    const invalidCourseNumbers = ["102ELEC", "ELEC102C", "EL$123"];
    const expectedError = {
      courseNumber: "Please enter a correct course number",
    };
    for (const invalidCourseNumber of invalidCourseNumbers) {
      input.courseNumber = invalidCourseNumber;
      expect(verifyInput(input, majors, electives)).toStrictEqual(
        expectedError
      );
    }
  });
  it("if the elective is already listed under the major listed in the request, return error", () => {
    input.courseNumber = "ELEC101"; // this is listed under m11111 and m11112 in the mock electives database
    let expectedError = {
      courseMajor:
        'ELEC101 is already listed under "Major One". Delete them from the list before proceeding',
    };
    expect(verifyInput(input, majors, electives)).toStrictEqual(expectedError);

    input.courseMajor.push({ doc_id: "m11112", majorName: "Major Two" });
    expectedError.courseMajor =
      'ELEC101 is already listed under "Major One", "Major Two". Delete them from the list before proceeding';
  });
});
