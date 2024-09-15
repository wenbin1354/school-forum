import { verifyInputs } from "./util";

describe("verifyInputs", () => {
  let input;
  let existingElectiveIds = ["courseId1"];
  const requiredKeys = [
    "courseId",
    "semesterYear",
    "semesterSeason",
    "professor",
    // "rating", test separately because its empty value is 0
    "commentHeader",
    "commentBody",
  ];
  beforeEach(() => {
    input = {
      attendance: "required",
      commentBody: "comment body",
      commentHeader: "comment header",
      courseId: "courseId1",
      displayName: "Anonymous",
      grade: "B",
      professor: "Firstname Lastname",
      rating: 4,
      semesterSeason: "Spring",
      semesterYear: 2023,
      tags: ["Homework Heavy"],
      textbook: "not required",
    };
  });
  it("OPTIONAL FIELDS: attendance and textbook are converted to boolean if submitted", () => {
    const verificationResult = verifyInputs(input, existingElectiveIds);
    expect(verificationResult.error).toStrictEqual({});
    expect(verificationResult.formattedInput.attendance).toBeTruthy();
    expect(verificationResult.formattedInput.textbook).toBeFalsy();
  });
  it("OPTIONAL FIELDS: remove attendance, textbook, and/or grade when their values are do not remember/prefer not to say or empty", () => {
    input.attendance = "do not remember";
    input.textbook = "";
    input.grade = "prefer not to say";

    const verificationResult = verifyInputs(input, existingElectiveIds);
    expect(verificationResult.error).toStrictEqual({});
    expect(verificationResult.formattedInput.attendance).toBeUndefined();
    expect(verificationResult.formattedInput.textbook).toBeUndefined();
    expect(verificationResult.formattedInput.grade).toBeUndefined();
  });
  it("REQUIRED FIELDS: return error if a single required field is not inputted", () => {
    for (const requiredKey of requiredKeys) {
      const newInput = { ...input, [requiredKey]: "" };
      const verificationResult = verifyInputs(newInput, existingElectiveIds);
      expect(verificationResult.error).toStrictEqual({
        [requiredKey]: "Required",
      });
    }
    const newInput = { ...input, rating: 0 };
    const verificationResult = verifyInputs(newInput, existingElectiveIds);
    expect(verificationResult.error).toStrictEqual({
      rating: "Required",
    });
  });
  it("REQUIRED FIELDS: return errors if multiple required fields is not inputted", () => {
    let expectedError = {};
    for (const requiredKey of requiredKeys) {
      input[requiredKey] = "";
      expectedError[requiredKey] = "Required";

      const verificationResult = verifyInputs(input, existingElectiveIds);
      expect(verificationResult.error).toStrictEqual(expectedError);
    }
  });
  it("return error if the class is taken before 2010 or a year that did not start yet", () => {
    jest.useFakeTimers().setSystemTime(new Date(2023, 1, 1));
    input.semesterYear = 2000;

    let verificationResult = verifyInputs(input, existingElectiveIds);
    expect(verificationResult.error).toStrictEqual({
      semesterYear: "Invalid Year",
    });

    input.semesterYear = 2020;
    verificationResult = verifyInputs(input, existingElectiveIds);
    expect(verificationResult.error).toStrictEqual({});

    input.semesterYear = 2024;
    verificationResult = verifyInputs(input, existingElectiveIds);
    expect(verificationResult.error).toStrictEqual({
      semesterYear: "Invalid Year",
    });
  });
  it("valid inputs will have its semesterYear and semesterSeason combined to a key named semester", () => {
    const verificationResult = verifyInputs(input, existingElectiveIds);
    expect(verificationResult.formattedInput.semester).toBe("2023 Spring");
    expect(verificationResult.formattedInput.semesterYear).toBeUndefined();
    expect(verificationResult.formattedInput.semesterSeason).toBeUndefined();
  });
  it("Professor name is trimmed and capitalized", () => {
    input.professor = "   someone special";
    const verificationResult = verifyInputs(input, existingElectiveIds);
    expect(verificationResult.formattedInput.professor).toBe("Someone Special");
  });
});
