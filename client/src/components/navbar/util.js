const PASSWORD_MIN_LEN = 6;
const authorizedEmails = ["@myhunter.cuny.edu", "@hunter.cuny.edu"];

export const isValidEmail = (email) => {
  const splitEmail = email.split("@");
  return (
    splitEmail.length === 2 &&
    splitEmail[0].length > 0 &&
    splitEmail[1].split(".").length >= 2 &&
    splitEmail[1].split(".")[0].length > 0 &&
    splitEmail[1].split(".")[1].length > 0
  );
};

const isAuthorizedEmail = (email) => {
  for (const authorizedEmail of authorizedEmails) {
    if (email.includes(authorizedEmail)) {
      return true;
    }
  }
  return false;
};

export const verifyLogInInput = (email, password) => {
  let errorMsg = {};
  if (!isValidEmail(email)) {
    errorMsg = {
      ...errorMsg,
      email: "Invalid Email",
    };
  }
  if (!password.length) {
    errorMsg = {
      ...errorMsg,
      password: "Required",
    };
  } else if (password.length < PASSWORD_MIN_LEN) {
    errorMsg = {
      ...errorMsg,
      password: "Invalid Password",
    };
  }
  return errorMsg;
};

export const verifySignUpInput = (input) => {
  let errorMsg = {};

  // Email
  if (!input.email.length) {
    errorMsg.email = "Required";
  } else if (!isValidEmail(input.email)) {
    errorMsg.email = "Invalid Email Address";
  } else if (!isAuthorizedEmail(input.email)) {
    errorMsg.email =
      "Email must end with @myhunter.cuny.edu or @hunter.cuny.edu";
  }

  // Display Name
  if (!input.displayName.length) {
    errorMsg.displayName = "Required";
  }

  // Password
  if (input.password.length < PASSWORD_MIN_LEN) {
    errorMsg.password = "Password is too short";
  }

  // Confirm Password
  if (input.confirmPassword != input.password) {
    errorMsg.confirmPassword = "Does not match the password";
  }

  return errorMsg;
};
