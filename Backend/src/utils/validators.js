// validators file — updated validateRegisterInput only
import { VALID_OCCUPATIONS } from "../constants/occupations.js"; // adjust path to your structure


export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password) => {
  
  return typeof password === "string" && password.length >= 8;
};


export const validateRegisterInput = ({
  name,
  email,
  password,
  shgName,
  district,
  state,
  occupation,
}) => {
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
  if (!shgName || shgName.trim().length < 2) {
    errors.push("SHG name is required.");
  }
  if (!district || district.trim().length === 0) {
    errors.push("District is required.");
  }
  if (!state || state.trim().length === 0) {
    errors.push("State is required.");
  }
  if (!occupation || !VALID_OCCUPATIONS.includes(occupation)) {
    errors.push("A valid occupation must be selected.");
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


// Validates a profile update request.
// Unlike onboarding, ALL fields are optional here — user may update
// just one field (e.g. only "bio") without sending the rest.
// We only check the type/shape of fields that are actually present.
export function validateProfileUpdateInput({ name, shgName, district, state, occupation }) {
  const errors = [];

  if (name !== undefined && (typeof name !== "string" || name.trim().length < 2)) {
    errors.push("Name must be at least 2 characters long.");
  }
  if (shgName !== undefined && (typeof shgName !== "string" || shgName.trim().length < 2)) {
    errors.push("SHG name must be at least 2 characters long.");
  }
  if (district !== undefined && typeof district !== "string") {
    errors.push("District must be text.");
  }
  if (state !== undefined && typeof state !== "string") {
    errors.push("State must be text.");
  }
  if (occupation !== undefined && !VALID_OCCUPATIONS.includes(occupation)) {
    errors.push("Invalid occupation selected.");
  }

  return errors;
}

export const validateForgotPasswordInput = ({ email }) => {
  const errors = [];

  if (!email || !isValidEmail(email)) {
    errors.push("A valid email is required.");
  }

  return errors;
};

export const validateResetPasswordInput = ({ token, newPassword }) => {
  const errors = [];

  if (!token || typeof token !== "string") {
    errors.push("A valid reset token is required.");
  }
  if (!newPassword || !isValidPassword(newPassword)) {
    errors.push("Password must be at least 8 characters long.");
  }

  return errors;
};