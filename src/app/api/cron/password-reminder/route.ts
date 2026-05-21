import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

// This route should be triggered monthly via Vercel Cron or a similar cron service.
export async function GET(req: Request) {
  // Optional: Verify cron secret if using Vercel Cron to prevent unauthorized triggers
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await sendEmail({
      to: "christianretreatcentrelagos@gmail.com",
      subject: "Monthly Security Reminder: Time to Change Admin Password",
      text: `Hello,\n\nThis is your automated monthly security reminder.\n\nIt is time to change your CRC Admin Portal password. Regular password updates help keep the portal secure.\n\nPlease log in to the admin portal and update your password.\n\nThank you,\nCRC Security System`,
      html: `
        <h3>Monthly Security Reminder</h3>
        <p>Hello,</p>
        <p>This is your automated monthly security reminder.</p>
        <p><strong>It is time to change your CRC Admin Portal password.</strong> Regular password updates help keep the portal secure.</p>
        <p>Please log in to the admin portal and update your password.</p>
        <br/>
        <p>Thank you,</p>
        <p>CRC Security System</p>
      `,
    });

    return NextResponse.json({ success: true, message: "Reminder sent." });
  } catch (error) {
    console.error("Cron email error:", error);
    return NextResponse.json({ success: false, error: "Failed to send reminder." }, { status: 500 });
  }
}
