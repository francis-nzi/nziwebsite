export const ENV = {
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: process.env.DATABASE_URL ?? "",
  // Password for the /admin area. Admin is switched off unless this is at least 10 characters.
  adminPassword: process.env.ADMIN_PASSWORD ?? "",
  // Email notifications for enquiries and bookings (https://resend.com)
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  notifyTo: process.env.NOTIFY_TO ?? "",
  notifyFrom: process.env.NOTIFY_FROM ?? "Net Zero International Website <website@netzero.international>",
};
