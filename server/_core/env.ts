export const ENV = {
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: process.env.DATABASE_URL ?? "",
  // Email notifications for enquiries and bookings (https://resend.com)
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  notifyTo: process.env.NOTIFY_TO ?? "",
  notifyFrom: process.env.NOTIFY_FROM ?? "Net Zero International Website <website@netzero.international>",
};
