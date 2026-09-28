const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace('import { ThemeProvider } from "next-themes";', 'import { ThemeProvider } from "next-themes";\nimport { ClerkProvider } from "@clerk/clerk-react";');

c = c.replace('const App = () => (', 'const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;\nif (!PUBLISHABLE_KEY) {\n  console.error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env");\n}\n\nconst App = () => (\n  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>');

c = c.replace('</ThemeProvider>\n);', '</ThemeProvider>\n  </ClerkProvider>\n);');

fs.writeFileSync('src/App.tsx', c);
