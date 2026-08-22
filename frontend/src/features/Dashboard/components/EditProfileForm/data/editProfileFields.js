// Defines which profile fields are editable and how to label them.
// Adding a new editable field later = add one entry here.
export const EDIT_PROFILE_FIELDS = [
  { name: "bio", label: "Bio", type: "textarea", placeholder: "Tell others a bit about yourself" },
  { name: "district", label: "District", type: "text", placeholder: "e.g. Meerut" },
  { name: "state", label: "State", type: "text", placeholder: "e.g. Uttar Pradesh" },
  { name: "workPreference", label: "Work preference", type: "text", placeholder: "e.g. Tailoring, Teaching" },
];