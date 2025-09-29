import nodemailer, { Transporter } from "nodemailer";

// define transporter type explicitly
export const transporter: Transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for 587
  auth: {
    user: "ganeshjipatel108@gmail.com",     // replace with your Gmail
    pass: "cnaw pjrw fwol ckfg", // use App Password, not your Gmail password
  },
});
