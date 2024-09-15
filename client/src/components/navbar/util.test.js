import { isValidEmail, verifyLogInInput, verifySignUpInput } from "./util";

describe("isValidEmail", () => {
  it("invalid email formats should return false", () => {
    const invalidEmails = [
      "",
      "email",
      "@email",
      "email@",
      "email@gmail",
      "email@gmail@gmail.com",
    ];
    for (const invalidEmail of invalidEmails) {
      expect(isValidEmail(invalidEmail)).toBeFalsy();
    }
  });
  it("valid email formats should return true", () => {
    const validEmails = [
      "email@gmail.com",
      "email@myhunter.cuny.edu",
      "email@something.com",
      "email@something.something.something.com",
    ];
    for (const validEmail of validEmails) {
      expect(isValidEmail(validEmail)).toBeTruthy();
    }
  });
});

describe("verifyLogInInput", () => {
  let email;
  let password;
  beforeEach(() => {
    email = "email@gmail.com";
    password = "password";
  });
  it("correctly formmated email and password return no error", () => {
    // We allow emails that do not belong to hunter domain for admin logins
    let emails = ["email@gmail.com", "email@myhunter.cuny.edu"];
    for (const email of emails) {
      expect(verifyLogInInput(email, password)).toStrictEqual({});
    }
  });
  it("invalid email return error", () => {
    let emails = ["", "email"];
    for (const email of emails) {
      expect(verifyLogInInput(email, password)).toStrictEqual({
        email: "Invalid Email",
      });
    }
  });
  it("no password returns error", () => {
    password = "";
    expect(verifyLogInInput(email, password)).toStrictEqual({
      password: "Required",
    });
  });
  it("password with fewer digits than required returns error", () => {
    password = "1";
    expect(verifyLogInInput(email, password)).toStrictEqual({
      password: "Invalid Password",
    });
  });
  it("multiple errors can be returned at once", () => {
    email = "email";
    password = "1";
    expect(verifyLogInInput(email, password)).toStrictEqual({
      email: "Invalid Email",
      password: "Invalid Password",
    });
  });
});

describe("verifySignUpInput", () => {
  let input;
  beforeEach(() => {
    input = {
      email: "email@myhunter.cuny.edu",
      displayName: "Display Name",
      password: "password",
      confirmPassword: "password",
    };
  });
  it("correct input returns no error", () => {
    expect(verifySignUpInput(input)).toStrictEqual({});
  });
  it("no email returns error", () => {
    input.email = "";
    expect(verifySignUpInput(input)).toStrictEqual({
      email: "Required",
    });
  });
  it("invalid email returns error", () => {
    input.email = "email";
    expect(verifySignUpInput(input)).toStrictEqual({
      email: "Invalid Email Address",
    });
  });
  it("non-hunter email returns error", () => {
    // admin accounts should not be registered here
    input.email = "email@gmail.com";
    expect(verifySignUpInput(input)).toStrictEqual({
      email: "Email must end with @myhunter.cuny.edu or @hunter.cuny.edu",
    });
  });
  it("no displayName returns error", () => {
    input.displayName = "";
    expect(verifySignUpInput(input)).toStrictEqual({
      displayName: "Required",
    });
  });
  it("password with less digits than required returns error", () => {
    input.password = "1";
    input.confirmPassword = "1";
    expect(verifySignUpInput(input)).toStrictEqual({
      password: "Password is too short",
    });
  });
  it("if password and confirmPassword do not match, return error ", () => {
    input.confirmPassword = "1";
    expect(verifySignUpInput(input)).toStrictEqual({
      confirmPassword: "Does not match the password",
    });
  });
  it("multiple error can be returned at once", () => {
    input = {
      email: "",
      displayName: "",
      password: "1",
      confirmPassword: "2",
    };
    expect(verifySignUpInput(input)).toStrictEqual({
      email: "Required",
      displayName: "Required",
      password: "Password is too short",
      confirmPassword: "Does not match the password",
    });
  });
});
