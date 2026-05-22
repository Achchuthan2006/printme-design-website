import sgMail from "@sendgrid/mail";
import { QuoteRequestInput } from "@/lib/validation";
import { siteConfig } from "@/lib/site";

const fromEmail = process.env.SENDGRID_FROM_EMAIL;
const adminEmail = process.env.SENDGRID_ADMIN_EMAIL;

function isSendGridConfigured() {
  return Boolean(process.env.SENDGRID_API_KEY && fromEmail && adminEmail);
}

export function configureSendGrid() {
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }
}

export function buildCustomerConfirmationEmail(data: QuoteRequestInput) {
  return {
    to: data.email,
    from: fromEmail ?? "quotes@printmedesign.com",
    subject: `We received your quote request | ${siteConfig.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #161616; line-height: 1.6;">
        <h2 style="margin-bottom: 12px;">Thanks for contacting ${siteConfig.name}</h2>
        <p>Hi ${data.fullName},</p>
        <p>We received your quote request for <strong>${data.serviceNeeded}</strong>. Our team will review your details and follow up with pricing, turnaround, and next steps.</p>
        <p><strong>Requested deadline:</strong> ${data.preferredDeadline}<br />
        <strong>Fulfillment:</strong> ${data.fulfillmentMethod}<br />
        <strong>Quantity:</strong> ${data.quantity}</p>
        <p>If you need to add more details before we reply, call us at ${siteConfig.phone}.</p>
        <p>Thanks,<br />${siteConfig.name}</p>
      </div>
    `,
  };
}

export function buildAdminNotificationEmail(data: QuoteRequestInput) {
  return {
    to: adminEmail ?? "hello@printmedesign.com",
    from: fromEmail ?? "quotes@printmedesign.com",
    subject: `New quote request from ${data.fullName}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #161616; line-height: 1.6;">
        <h2 style="margin-bottom: 12px;">New quote request submitted</h2>
        <p><strong>Name:</strong> ${data.fullName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Company:</strong> ${data.companyName || "Not provided"}</p>
        <p><strong>Service:</strong> ${data.serviceNeeded}</p>
        <p><strong>Quantity:</strong> ${data.quantity}</p>
        <p><strong>Deadline:</strong> ${data.preferredDeadline}</p>
        <p><strong>Fulfillment:</strong> ${data.fulfillmentMethod}</p>
        <p><strong>Project details:</strong><br />${data.projectDetails.replace(/\n/g, "<br />")}</p>
      </div>
    `,
  };
}

export async function sendQuoteEmails(data: QuoteRequestInput) {
  if (!isSendGridConfigured()) {
    return {
      skipped: true,
      reason: "SendGrid environment variables are not configured.",
    };
  }

  configureSendGrid();

  await sgMail.send(buildCustomerConfirmationEmail(data));
  await sgMail.send(buildAdminNotificationEmail(data));

  return { skipped: false };
}

export function buildOrderConfirmationEmail(orderNumber: string, email: string) {
  return {
    to: email,
    from: fromEmail ?? "quotes@printmedesign.com",
    subject: `PrintMe order received | ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #161616; line-height: 1.6;">
        <h2>Your PrintMe order has been received</h2>
        <p>Thanks for ordering with PrintMe. Your order number is <strong>${orderNumber}</strong>.</p>
        <p>We will review artwork, timing, pickup or delivery details, and follow up if anything needs attention.</p>
      </div>
    `,
  };
}

export function buildStatusUpdateEmail(orderNumber: string, email: string, status: string) {
  return {
    to: email,
    from: fromEmail ?? "quotes@printmedesign.com",
    subject: `PrintMe order update | ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #161616; line-height: 1.6;">
        <h2>Order status update</h2>
        <p>Your order <strong>${orderNumber}</strong> is now marked as <strong>${status}</strong>.</p>
      </div>
    `,
  };
}

// Future integration point:
// - send payment links after Stripe checkout is added
// - trigger order status emails for production updates
