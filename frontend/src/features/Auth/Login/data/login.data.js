export const loginData = {
  heading: "Welcome back",
  subheading: "Log in to continue learning, connecting, and helping your community.",
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
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter your password",
        autoComplete: "current-password",
        required: true,
      },
    ],
    submitLabel: "Log in",
  },
  forgotPassword: {
    text: "Forgot your password?",
    linkHref: "/forgot-password",
  },
  footer: {
    text: "Don't have an account?",
    linkLabel: "Create one",
    linkHref: "/register",
  },
};


