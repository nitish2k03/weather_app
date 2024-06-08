/** @type {import('next').NextConfig} */
const nextConfig = {
  remotePatterns: [
    {
      protocol: "http",
      hostname: "openweathermap.org",
      port: "",
      pathname: "**",
    },
  ],
};

export default nextConfig;
