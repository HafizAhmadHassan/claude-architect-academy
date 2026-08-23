import type { NextConfig } from "next";

const repo = "claude-architect-academy";
const owner = "HafizAhmadHassan";
const isGitHubPages = process.env.DEPLOY_TARGET === "github-pages";

const nextConfig: NextConfig = isGitHubPages
  ? {
      output: "export",
      basePath: `/${repo}`,
      assetPrefix: `/${repo}/`,
      trailingSlash: true,
      images: { unoptimized: true },
      env: {
        NEXT_PUBLIC_SITE_URL: `https://${owner}.github.io/${repo}`,
      },
    }
  : {};

export default nextConfig;
