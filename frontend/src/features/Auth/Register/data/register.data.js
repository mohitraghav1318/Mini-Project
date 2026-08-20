export const registerData = {
  heading: "Start your journey",
  subheading:
    "Join thousands of women learning, connecting, and helping each other — completely free.",
  form: {
    fields: [
      {
        name: "name",
        label: "Full name",
        type: "text",
        placeholder: "Enter your name",
        autoComplete: "name",
        required: true,
      },
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
        placeholder: "At least 6 characters",
        autoComplete: "new-password",
        required: true,
      },
    ],
    submitLabel: "Create account",
  },
  footer: {
    text: "Already have an account?",
    linkLabel: "Log in",
    linkHref: "/login",
  },
};
