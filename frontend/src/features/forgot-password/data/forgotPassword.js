export const forgotPasswordData = {
  heading: "Forgot your password?",
  subheading: "Enter your email and we'll send you a link to reset it.",
  form: {
    fields: [
      {
        name: "email",
        label: "Email address",
        type: "email",
        placeholder: "you@example.com",
        autoComplete: "email",
        required: true,
      },
    ],
    submitLabel: "Send reset link",
  },
  successMessage:
    "If an account with that email exists, we've sent a reset link. Please check your inbox.",
  footer: {
    text: "Remembered your password?",
    linkLabel: "Log in",
    linkHref: "/login",
  },
};