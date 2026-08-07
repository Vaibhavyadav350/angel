const https = require('https');
const jwt = require('jsonwebtoken');
const catchAsyncErrors = require('./CatchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');

/**
 * Customer authentication via Firebase ID token.
 *
 * Order endpoints previously trusted an email posted in the request body, so
 * anyone who knew a customer's address could retrieve their full order history —
 * name, phone number, shipping address and totals — with no credentials at all.
 *
 * Firebase ID tokens are ordinary RS256 JWTs and Google publishes the signing
 * certificates, so they can be verified with nothing but the public project id.
 * No service-account private key is needed, which is why this works from the
 * configuration already on hand.
 *
 * Verification follows Google's documented requirements:
 *   • signature checks out against the certificate named by the token's `kid`
 *   • alg is RS256
 *   • aud === the project id
 *   • iss === https://securetoken.google.com/<project id>
 *   • exp in the future, iat/auth_time in the past
 *   • sub is a non-empty string
 */

const CERT_URL =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

let certCache = { keys: null, expiresAt: 0 };

// Google rotates these roughly daily and states the lifetime in Cache-Control.
const fetchCertificates = () =>
  new Promise((resolve, reject) => {
    https
      .get(CERT_URL, (res) => {
        let body = '';
        res.on('data', (chunk) => (chunk ? (body += chunk) : null));
        res.on('end', () => {
          if (res.statusCode !== 200) return reject(new Error(`Cert fetch failed: ${res.statusCode}`));
          try {
            const keys = JSON.parse(body);
            const maxAge = /max-age=(\d+)/.exec(res.headers['cache-control'] || '');
            const ttl = maxAge ? Number(maxAge[1]) * 1000 : 60 * 60 * 1000;
            resolve({ keys, ttl });
          } catch (err) {
            reject(err);
          }
        });
      })
      .on('error', reject);
  });

const getCertificates = async () => {
  if (certCache.keys && Date.now() < certCache.expiresAt) return certCache.keys;
  const { keys, ttl } = await fetchCertificates();
  certCache = { keys, expiresAt: Date.now() + ttl };
  return keys;
};

/** Verify a Firebase ID token and return its decoded payload. */
exports.verifyFirebaseToken = async (idToken) => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error('FIREBASE_PROJECT_ID is not configured');

  const decoded = jwt.decode(idToken, { complete: true });
  if (!decoded || !decoded.header) throw new Error('Malformed token');
  if (decoded.header.alg !== 'RS256') throw new Error('Unexpected token algorithm');

  const certs = await getCertificates();
  const cert = certs[decoded.header.kid];
  if (!cert) throw new Error('Unknown signing key');

  return jwt.verify(idToken, cert, {
    algorithms: ['RS256'],
    audience: projectId,
    issuer: `https://securetoken.google.com/${projectId}`,
  });
};

const bearerFrom = (req) => {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7).trim() : null;
};

/**
 * Require a signed-in customer. Populates `req.customer` with the VERIFIED
 * identity — controllers must read the email from there, never from the body.
 */
exports.isAuthenticatedCustomer = catchAsyncErrors(async (req, res, next) => {
  const token = bearerFrom(req);
  if (!token) {
    return next(new ErrorHandler('Please sign in to view this', 401));
  }

  try {
    const payload = await exports.verifyFirebaseToken(token);
    if (!payload.sub) throw new Error('Token has no subject');
    req.customer = {
      uid: payload.sub,
      email: (payload.email || '').toLowerCase(),
      emailVerified: Boolean(payload.email_verified),
    };
    return next();
  } catch (err) {
    console.warn(`[CUSTOMER AUTH DENIED] ${req.method} ${req.originalUrl} — ${err.message}`);
    return next(new ErrorHandler('Your session has expired. Please sign in again.', 401));
  }
});
