const fs = require('fs');
let c = fs.readFileSync('server/routes/adminRoutes.js', 'utf8');

c = c.replace('const express = require("express");', 'const express = require("express");\nconst { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");');

const middlewareRepl = 'const verifyAdminPassword = ClerkExpressRequireAuth();';

c = c.replace(/const verifyAdminPassword = \(req, res, next\) => \{[\s\S]*?next\(\);\n\};/, middlewareRepl);

fs.writeFileSync('server/routes/adminRoutes.js', c);
