import api from "./axios";

// 🔹 Payload du formulaire contact
export interface ContactPayload {
  fullname: string;
  email: string;
  subject: string;
  message: string;
}

// 🔹 POST /contact
export const sendContact = (data: ContactPayload) => {
  return api.post("/contact", data);
};
