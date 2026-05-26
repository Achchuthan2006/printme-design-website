import sgMail from "@sendgrid/mail";
import type { QuoteRequestInput } from "@/lib/validation";
import { siteConfig } from "@/lib/site";
import { env, isSendGridConfigured } from "@/lib/env";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function configureSendGrid() {
  if (env.sendGridApiKey) {
    sgMail.setApiKey(env.sendGridApiKey);
  }
}

export function buildCustomerConfirmationEmail(data: QuoteRequestInput) {
  const fullName = escapeHtml(data.fullName);
  const serviceNeeded = escapeHtml(data.serviceNeeded);
  const preferredDeadline = escapeHtml(data.preferredDeadline);
  const fulfillmentMethod = escapeHtml(data.fulfillmentMethod);
  const quantity = escapeHtml(data.quantity);

  return {
    to: data.email,
    from: env.sendGridFromEmail ?? "quotes@printmedesign.com",
    subject: `We received your quote request | ${siteConfig.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #161616; line-height: 1.6;">
        <h2 style="margin-bottom: 12px;">Thanks for contacting ${siteConfig.name}</h2>
        <p>Hi ${fullName},</p>
        <p>We received your quote request for <strong>${serviceNeeded}</strong>. Our team will review your details and follow up with pricing, turnaround, and next steps.</p>
        <p><strong>Requested deadline:</strong> ${preferredDeadline}<br />
        <strong>Fulfillment:</strong> ${fulfillmentMethod}<br />
        <strong>Quantity:</strong> ${quantity}</p>
        <p>If you need to add more details before we reply, call us at ${siteConfig.phone}.</p>
        <p>Thanks,<br />${siteConfig.name}</p>
      </div>
    `,
  };
}

export function buildAdminNotificationEmail(data: QuoteRequestInput) {
  const projectDetails = escapeHtml(data.projectDetails).replace(/\n/g, "<br />");

  return {
    to: env.sendGridAdminEmail ?? "hello@printmedesign.com",
    from: env.sendGridFromEmail ?? "quotes@printmedesign.com",
    subject: `New quote request from ${escapeHtml(data.fullName)}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #161616; line-height: 1.6;">
        <h2 style="margin-bottom: 12px;">New quote request submitted</h2>
        <p><strong>Name:</strong> ${escapeHtml(data.fullName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
        <p><strong>Company:</strong> ${data.companyName ? escapeHtml(data.companyName) : "Not provided"}</p>
        <p><strong>Service:</strong> ${escapeHtml(data.serviceNeeded)}</p>
        <p><strong>Quantity:</strong> ${escapeHtml(data.quantity)}</p>
        <p><strong>Deadline:</strong> ${escapeHtml(data.preferredDeadline)}</p>
        <p><strong>Fulfillment:</strong> ${escapeHtml(data.fulfillmentMethod)}</p>
        <p><strong>Project details:</strong><br />${projectDetails}</p>
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
    from: env.sendGridFromEmail ?? "quotes@printmedesign.com",
    subject: `PrintMe order received | ${escapeHtml(orderNumber)}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #161616; line-height: 1.6;">
        <h2>Your PrintMe order has been received</h2>
        <p>Thanks for ordering with PrintMe. Your order number is <strong>${escapeHtml(orderNumber)}</strong>.</p>
        <p>We will review artwork, timing, pickup or delivery details, and follow up if anything needs attention.</p>
      </div>
    `,
  };
}

export function buildPaymentConfirmedEmail(orderNumber: string, email: string, fullName?: string) {
  return {
    to: email,
    from: env.sendGridFromEmail ?? "quotes@printmedesign.com",
    subject: `Payment confirmed | ${escapeHtml(orderNumber)}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #161616; line-height: 1.6;">
        <h2>Payment confirmed</h2>
        <p>${fullName ? `Hi ${escapeHtml(fullName)},` : "Hi,"}</p>
        <p>We have confirmed payment for order <strong>${escapeHtml(orderNumber)}</strong>.</p>
        <p>Your job will now move through artwork review, production, and pickup or delivery scheduling. If our team needs anything else, we will contact you directly.</p>
      </div>
    `,
  };
}

export function buildStatusUpdateEmail(orderNumber: string, email: string, status: string) {
  return {
    to: email,
    from: env.sendGridFromEmail ?? "quotes@printmedesign.com",
    subject: `PrintMe order update | ${escapeHtml(orderNumber)}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #161616; line-height: 1.6;">
        <h2>Order status update</h2>
        <p>Your order <strong>${escapeHtml(orderNumber)}</strong> is now marked as <strong>${escapeHtml(status)}</strong>.</p>
      </div>
    `,
  };
}

export function buildUploadReceivedEmail(email: string, fileName: string, relatedLabel?: string) {
  return {
    to: email,
    from: env.sendGridFromEmail ?? "quotes@printmedesign.com",
    subject: `Artwork received | ${siteConfig.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #161616; line-height: 1.6;">
        <h2>Artwork upload received</h2>
        <p>We received your file <strong>${escapeHtml(fileName)}</strong>${relatedLabel ? ` for <strong>${escapeHtml(relatedLabel)}</strong>` : ""}.</p>
        <p>Our team will review the file for size, bleed, resolution, and print readiness. If anything needs attention, we will let you know with the next step.</p>
      </div>
    `,
  };
}

// Future integration point:
// - send payment links after Stripe checkout is added
// - trigger order status emails for production updates
