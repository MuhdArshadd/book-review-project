import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Book Collection",
  description: "Architecture, API, testing, and deployment documentation",
  base: process.env.DOCS_BASE || "/",
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: "Guide", link: "/architecture" },
      { text: "API", link: "/api" },
      { text: "Testing", link: "/testing" },
      { text: "Deployment", link: "/deployment" },
    ],
    sidebar: [
      { text: "Overview", link: "/" },
      { text: "Architecture", link: "/architecture" },
      { text: "API", link: "/api" },
      { text: "Database", link: "/database" },
      { text: "Local development", link: "/local-development" },
      { text: "Testing", link: "/testing" },
      { text: "CI/CD", link: "/ci-cd" },
      { text: "Deployment", link: "/deployment" },
      { text: "Security", link: "/security" },
      { text: "Public demo", link: "/demo" },
      { text: "QA dashboard", link: "/qa-dashboard" },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/" }],
    search: { provider: "local" },
  },
});
