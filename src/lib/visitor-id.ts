import crypto from "node:crypto";

let rotatingSalt: string | null = null;
let rotatingDate: Date | null = null;

async function getDailySalt(): Promise<string> {
  const now = new Date();
  const currentDateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD in UTC

  // Check if cached salt is still valid for today
  if (
    rotatingSalt &&
    rotatingDate &&
    rotatingDate.toISOString().split("T")[0] === currentDateStr
  ) {
    return rotatingSalt;
  }

  // Generate new salt for today
  const secret = process.env.BETTER_AUTH_SECRET!;

  rotatingSalt = crypto
    .createHash("sha512")
    .update(secret + currentDateStr)
    .digest("hex");
  rotatingDate = now;

  return rotatingSalt;
}

export default async function generateVisitorId(ip: string, userAgent: string): Promise<string> {
  const salt = await getDailySalt();
  return crypto.createHash("sha512").update(ip + userAgent + salt).digest("hex");
}