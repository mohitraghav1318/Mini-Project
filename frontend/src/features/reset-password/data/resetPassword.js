export const resetPasswordData = {
  heading: "Set a new password",
  subheading: "Choose a new password to regain access to your account.",
  form: {
    fields: [
      {
        name: "newPassword",
        label: "New password",
        type: "password",
        placeholder: "Enter new password",
        autoComplete: "new-password",
        required: true,
      },
      {
        name: "confirmPassword",
        label: "Confirm new password",
        type: "password",
        placeholder: "Re-enter new password",
        autoComplete: "new-password",
        required: true,
      },
    ],
    submitLabel: "Reset password",
  },
  invalidTokenMessage:
    "This reset link is invalid or has expired. Please request a new one.",
  footer: {
    text: "Remembered your password?",
    linkLabel: "Log in",
    linkHref: "/login",
  },
};