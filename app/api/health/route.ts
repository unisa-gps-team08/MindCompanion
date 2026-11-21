import mongoose from "mongoose";

export async function GET() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return Response.json({ status: "unavailable" }, { status: 503 });
  }

  try {
    const client = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3_000,
      socketTimeoutMS: 3_000,
    });
    await client.connection.getClient().db().command({ ping: 1 });

    return Response.json({ status: "ok" });
  } catch {
    return Response.json({ status: "unavailable" }, { status: 503 });
  }
}
