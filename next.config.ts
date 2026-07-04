import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Default is 1MB; activity creation can include up to 8 images at
      // up to 5MB each (see MAX_FILE_SIZE/MAX_IMAGES_PER_ACTIVITY in
      // src/lib/uploads.ts), so the default limit rejected real uploads
      // with an opaque 500 before the app's own per-file validation could
      // run and give a clear error message.
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
