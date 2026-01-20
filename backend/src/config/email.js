import { Resend } from "resend";

let resend = null;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn(
    "RESEND_API_KEY not found. Email functionality will be disabled."
  );
}

export const sendEmail = async (to, subject, html) => {
  if (!resend) {
    return { success: false, error: "Email service not configured" };
  }

  try {
    const data = await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to: [to],
      subject,
      html,
    });

    return { success: true, messageId: data.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default resend;
