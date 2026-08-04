import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Next 16 rejects any `quality` not in this allowlist (a request for an
     * unlisted value returns an error, not a fallback). 40 is for the two
     * background textures, which render at 10% opacity where the loss is
     * imperceptible but the byte saving is not; 75 is the default.
     */
    qualities: [40, 75],
  },
};

export default nextConfig;
