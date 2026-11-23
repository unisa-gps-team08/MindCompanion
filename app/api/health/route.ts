import { connectDB } from "@/db/connect";

export async function GET() {
  try {
    const db = await connectDB();
    await db.connection.getClient().db().command({ ping: 1 });

    return Response.json({ status: "ok" });
  } catch {
    return Response.json({ status: "unavailable" }, { status: 503 });
  }
}
