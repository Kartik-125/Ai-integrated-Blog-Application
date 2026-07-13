import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Daily Reads <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    console.log("Resend Data:", data);
    console.log("Resend Error:", error);


    if (error) {
      console.error(error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Email Error:", error);
    return false;
  }
};