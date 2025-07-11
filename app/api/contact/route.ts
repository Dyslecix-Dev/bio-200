import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user, email, ...formData } = body;

    const msg = {
      to: "dyslecixdev@gmail.com",
      from: "dyslecixdev@gmail.com",
      subject: "New Contact Form Submission",
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${user}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr>
        ${Object.entries(formData)
          .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
          .join("")}
      `,
      text: `
        New Contact Form Submission
        
        From: ${user}
        Email: ${email}
        
        ${Object.entries(formData)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n")}
      `,
    };

    await sgMail.send(msg);

    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("SendGrid error:", error);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}
