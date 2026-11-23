import mongoose from "mongoose";

// Mongoose riusa la connessione attiva: chiamarla a ogni richiesta è sicuro.
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI non impostata");

  return mongoose.connect(uri, { serverSelectionTimeoutMS: 3_000 });
}
