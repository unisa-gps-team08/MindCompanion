import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // In sviluppo Next.js accetta solo localhost: senza questa voce, aprendo
  // http://127.0.0.1:3000 (il link del README) il browser non si collega al
  // server di sviluppo e il JavaScript delle pagine non si attiva (#13).
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
