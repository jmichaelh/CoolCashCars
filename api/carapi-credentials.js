import express from ‘express’;
import dotenv from ‘dotenv’;

// Load environment variables from .env file
dotenv.config({ path: '/../.env' });

const router = express.Router();

// IMPORTANT: Add authentication middleware here to protect this endpoint
// Only authenticated users should be able to access these credentials
const requireAuth = (req, res, next) => {
// Example: Check if user is authenticated via session/JWT
if (!req.session?.user && !req.user) {
return res.status(401).json({ error: ‘Unauthorized’ });
}
next();
};

// Endpoint to provide CarAPI credentials
router.get(’/api/carapi-credentials’, requireAuth, async (req, res) => {
try {
// Get credentials from environment variables
const token = process.env.CARAPI_TOKEN;
const secret = process.env.CARAPI_SECRET;

```
// Verify credentials exist
if (!token || !secret) {
  console.error('CarAPI credentials not found in environment variables');
  return res.status(500).json({ 
    error: 'Credentials not configured',
    token: null,
    secret: null 
  });
}

// Optional: Rate limiting per user
// Implement rate limiting to prevent abuse

// Return credentials (only to authenticated users)
res.json({
  token: token,
  secret: secret
});
```

} catch (error) {
console.error(‘Error retrieving CarAPI credentials:’, error);
res.status(500).json({
error: ‘Failed to retrieve credentials’,
token: null,
secret: null
});
}
});

export default router;

// ============================================
// Alternative: Next.js API Route
// pages/api/carapi-credentials.js
// ============================================

export default async function handler(req, res) {
// Only allow GET requests
if (req.method !== ‘GET’) {
return res.status(405).json({ error: ‘Method not allowed’ });
}

// IMPORTANT: Add authentication check here
// Example with next-auth:
// const session = await getSession({ req });
// if (!session) {
//   return res.status(401).json({ error: ‘Unauthorized’ });
// }

try {
const token = process.env.CARAPI_TOKEN;
const secret = process.env.CARAPI_SECRET;

```
if (!token || !secret) {
  return res.status(500).json({ 
    error: 'Credentials not configured',
    token: null,
    secret: null 
  });
}

res.status(200).json({
  token: token,
  secret: secret
});
```

} catch (error) {
console.error(‘Error:’, error);
res.status(500).json({
error: ‘Failed to retrieve credentials’,
token: null,
secret: null
});
}
}

// ============================================
// .env file example (NEVER commit this file)
// ============================================

/*

# .env file - Keep this file secure and add to .gitignore!

# CarAPI Credentials

CARAPI_TOKEN=your_actual_carapi_token_here
CARAPI_SECRET=your_actual_carapi_secret_here

# Database

DATABASE_URL=your_database_url

# Other environment variables

NODE_ENV=production
PORT=3000
*/

// ============================================
// .gitignore - Make sure to add this
// ============================================

/*

# Environment variables

.env
.env.local
.env.production
.env.development

# Dependencies

node_modules/

# Build files

dist/
build/
.next/

# Logs

*.log
*/

// ============================================
// Security Best Practices
// ============================================

/*

1. NEVER commit .env files to version control
1. Add .env to .gitignore immediately
1. Use different credentials for development and production
1. Implement authentication middleware to protect the endpoint
1. Add rate limiting to prevent abuse
1. Use HTTPS in production
1. Rotate credentials regularly
1. Monitor API usage for suspicious activity
1. Consider using a secrets manager (AWS Secrets Manager, Azure Key Vault, etc.)
1. Log access attempts for security auditing
   */

// ============================================
// Example with Authentication & Rate Limiting
// ============================================

import rateLimit from ‘express-rate-limit’;

// Rate limiter: 10 requests per 15 minutes per IP
const limiter = rateLimit({
windowMs: 15 * 60 * 1000,
max: 10,
message: ‘Too many requests, please try again later’
});

router.get(’/api/carapi-credentials’,
limiter,           // Apply rate limiting
requireAuth,       // Require authentication
async (req, res) => {
// Your credential logic here

```
// Log the access for security monitoring
console.log(`CarAPI credentials accessed by user: ${req.user?.id || 'unknown'}`);

res.json({
  token: process.env.CARAPI_TOKEN,
  secret: process.env.CARAPI_SECRET
});
```

}
);
