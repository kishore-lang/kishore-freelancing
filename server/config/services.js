/**
 * Server-Side Trusted Pricing Catalog for Freelance Services.
 * Enforces server-side amounts to prevent client tampering.
 */
const SERVICES = {
  "fullstack-web-app": {
    id: "fullstack-web-app",
    key: "fullstack-web-app",
    name: "Full-Stack Web Application",
    amount: 24999,
  },
  "saas-mvp-dev": {
    id: "saas-mvp-dev",
    key: "saas-mvp-dev",
    name: "SaaS & MVP Product Development",
    amount: 34999,
  },
  "ecommerce-platform": {
    id: "ecommerce-platform",
    key: "ecommerce-platform",
    name: "E-Commerce Platform Solution",
    amount: 18999,
  },
  "frontend-ui-ux": {
    id: "frontend-ui-ux",
    key: "frontend-ui-ux",
    name: "Modern UI/UX & Frontend Engineering",
    amount: 11999,
  },
  "backend-api-architecture": {
    id: "backend-api-architecture",
    key: "backend-api-architecture",
    name: "REST API & Cloud Backend Architecture",
    amount: 14999,
  },
  "seo-performance-audit": {
    id: "seo-performance-audit",
    key: "seo-performance-audit",
    name: "Performance Optimization & SEO Audit",
    amount: 6999,
  },
  "camera-rental": {
    id: "camera-rental",
    key: "camera-rental",
    name: "Cinema Camera & Production Gear Rental",
    amount: 2500,
  },
  "custom-solution": {
    id: "custom-solution",
    key: "custom-solution",
    name: "Custom Enterprise & Tailored Solutions",
    isCustom: true,
  },

  // Legacy & Alias mappings for backwards compatibility
  fullstack: {
    id: "fullstack-web-app",
    key: "fullstack-web-app",
    name: "Full-Stack Web Application",
    amount: 24999,
  },
  ecommerce: {
    id: "ecommerce-platform",
    key: "ecommerce-platform",
    name: "E-Commerce Platform Solution",
    amount: 18999,
  },
  react: {
    id: "frontend-ui-ux",
    key: "frontend-ui-ux",
    name: "Modern UI/UX & Frontend Engineering",
    amount: 11999,
  },
  portfolio: {
    id: "frontend-ui-ux",
    key: "frontend-ui-ux",
    name: "Modern UI/UX & Frontend Engineering",
    amount: 11999,
  },
  api: {
    id: "backend-api-architecture",
    key: "backend-api-architecture",
    name: "REST API & Cloud Backend Architecture",
    amount: 14999,
  },
  custom: {
    id: "custom-solution",
    key: "custom-solution",
    name: "Custom Enterprise & Tailored Solutions",
    isCustom: true,
  },
  "custom-project": {
    id: "custom-solution",
    key: "custom-solution",
    name: "Custom Enterprise & Tailored Solutions",
    isCustom: true,
  },
};

module.exports = SERVICES;
