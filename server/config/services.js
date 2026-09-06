/**
 * Server-Side Trusted Pricing Catalog for Freelance Services.
 * Supports both canonical keys (portfolio, react, ecommerce, fullstack, api, custom)
 * and detailed hyphenated keys (react-website, etc.).
 */
const SERVICES = {
  // Canonical keys
  portfolio: {
    id: "portfolio",
    key: "portfolio",
    name: "Portfolio Website",
    amount: 2000,
  },
  react: {
    id: "react",
    key: "react",
    name: "React Website",
    amount: 3000,
  },
  ecommerce: {
    id: "ecommerce",
    key: "ecommerce",
    name: "E-Commerce Website",
    amount: 8000,
  },
  fullstack: {
    id: "fullstack",
    key: "fullstack",
    name: "Full-Stack Web Application",
    amount: 10000,
  },
  api: {
    id: "api",
    key: "api",
    name: "API / Backend Integration",
    amount: 4000,
  },
  custom: {
    id: "custom",
    key: "custom",
    name: "Custom Project",
    isCustom: true,
  },
  test: {
    id: "test",
    key: "test",
    name: "Test Package",
    amount: 5,
  },

  // Aliases for compatibility
  "portfolio-website": {
    id: "portfolio",
    key: "portfolio",
    name: "Portfolio Website",
    amount: 2000,
  },
  "react-website": {
    id: "react",
    key: "react",
    name: "React Website",
    amount: 3000,
  },
  "e-commerce-website": {
    id: "ecommerce",
    key: "ecommerce",
    name: "E-Commerce Website",
    amount: 8000,
  },
  "fullstack-application": {
    id: "fullstack",
    key: "fullstack",
    name: "Full-Stack Web Application",
    amount: 10000,
  },
  "api-backend-integration": {
    id: "api",
    key: "api",
    name: "API / Backend Integration",
    amount: 4000,
  },
  "custom-project": {
    id: "custom",
    key: "custom",
    name: "Custom Project",
    isCustom: true,
  },
  "test-package": {
    id: "test",
    key: "test",
    name: "Test Package",
    amount: 5,
  },
};

module.exports = SERVICES;
