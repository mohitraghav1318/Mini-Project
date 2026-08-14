export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password) => {
  // Minimum 8 chars, at least one letter and one number
  return typeof password === "string" && password.length >= 8;
};

export const validateRegisterInput = ({ name, email, password }) => {
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long.");
  }
  if (!email || !isValidEmail(email)) {
    errors.push("A valid email is required.");
  }
  if (!password || !isValidPassword(password)) {
    errors.push("Password must be at least 8 characters long.");
  }

  return errors;
};

export const validateLoginInput = ({ email, password }) => {
  const errors = [];

  if (!email || !isValidEmail(email)) {
    errors.push("A valid email is required.");
  }
  if (!password) {
    errors.push("Password is required.");
  }

  return errors;
};