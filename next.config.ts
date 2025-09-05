import type { NextConfig } from "next";

import withSerwistInit from "@serwist/next";


const nextConfig: NextConfig = {
  /* config options here */
};

const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
});

export default withSerwist(nextConfig);
