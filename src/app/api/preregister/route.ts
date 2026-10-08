import { handleRegistration } from "@/lib/waitlist";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  return handleRegistration(request, process.env);
}
