/*
 * PROTOTIPO LOCALE NON DISTRIBUIBILE.
 * Google OIDC server-code exchange with per-browser state binding.
 * Still needs a dedicated OAuth client, a browser integration, cross-account
 * tests, deployment review, and a complete security review before use.
 */
'use strict';

// PUBLIC SOURCE SNAPSHOT. Approved emails have been anonymized.
 // Replace .invalid placeholders with the private approved account identities
 // before any future deployment. The currently deployed V35 is unchanged.
const IDLAB_ALLOWED = Object.freeze({
  'owner@example.invalid': true,
  'alina@example.invalid': true
});
const IDLAB_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const IDLAB_AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const IDLAB_LOGIN_TTL_SECONDS = 600;
const IDLAB_SESSION_TTL_MS = 12 * 60 * 60 * 1000;

function idlabFail_() {
  throw new Error('Accesso negato o configurazione non disponibile');
}
function idlabValidRandom_(s) {
  // Browser integration MUST obtain these bytes with crypto.getRandomValues.
  return typeof s === 'string' && /^[A-Za-z0-9_-]{43}$/.test(s);
}
function idlabDigest_(s) {
  return Utilities.base64EncodeWebSafe(Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256, s, Utilities.Charset.UTF_8
  )).replace(/=+$/, '');
}
function idlabConfig_() {
  const p = PropertiesService.getScriptProperties();
  const clientId = p.getProperty('ALINA_OIDC_CLIENT_ID') || '';
  const clientSecret = p.getProperty('ALINA_OIDC_CLIENT_SECRET') || '';
  const redirect = p.getProperty('ALINA_OIDC_REDIRECT_URI') || '';
  if (!/^[A-Za-z0-9-]+\.apps\.googleusercontent\.com$/.test(clientId) ||
      !clientSecret || clientSecret.length > 512 ||
      !/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(redirect)) idlabFail_();
  return {clientId: clientId, clientSecret: clientSecret, redirect: redirect};
}
function idlabPendingKey_(state) {
  return 'alina_oidc_pending_' + idlabDigest_(state);
}
function idlabSessionKey_(sessionSecret) {
  return 'ALINA_OIDC_SESSION_' + idlabDigest_(sessionSecret);
}
function idlabWithLock_(fn) {
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try { return fn(); } finally { lock.releaseLock(); }
}

// All four values come from independent, cryptographically random browser bytes.
function beginIdentityLogin(browserSecret, state, nonce, pkceVerifier) {
  if (![browserSecret, state, nonce, pkceVerifier].every(idlabValidRandom_) ||
      new Set([browserSecret, state, nonce, pkceVerifier]).size !== 4) idlabFail_();
  const cfg = idlabConfig_();
  const cache = CacheService.getScriptCache();
  const pending = {
    browserDigest: idlabDigest_(browserSecret),
    nonce: nonce,
    verifier: pkceVerifier,
    expiresAt: Date.now() + IDLAB_LOGIN_TTL_SECONDS * 1000
  };
  idlabWithLock_(function () {
    const key = idlabPendingKey_(state);
    if (cache.get(key)) idlabFail_();
    cache.put(key, JSON.stringify(pending), IDLAB_LOGIN_TTL_SECONDS);
  });
  const q = {
    client_id: cfg.clientId,
    redirect_uri: cfg.redirect,
    response_type: 'code',
    scope: 'openid email',
    state: state,
    nonce: nonce,
    code_challenge: idlabDigest_(pkceVerifier),
    code_challenge_method: 'S256'
  };
  return {authorizationUrl: IDLAB_AUTHORIZE_URL + '?' + Object.keys(q).map(
    function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(q[k]); }
  ).join('&')};
}

function idlabReadClaimsFromDirectGoogleResponse_(idToken, cfg, expectedNonce) {
  // Called only on a token obtained by server-side TLS directly from Google.
  // Per Google's OIDC guidance a token received directly from Google is trusted
  // for its signature; all claims below still have to be validated.
  if (typeof idToken !== 'string' || idToken.length > 20000) idlabFail_();
  const parts = idToken.split('.');
  if (parts.length !== 3 || !parts.every(function(x) { return /^[A-Za-z0-9_-]+$/.test(x); })) idlabFail_();
  let claims;
  try { claims = JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(parts[1])).getDataAsString()); }
  catch (_) { idlabFail_(); }
  const seconds = Math.floor(Date.now() / 1000);
  const email = typeof claims.email === 'string' ? claims.email.toLowerCase() : '';
  if ((claims.iss !== 'https://accounts.google.com' && claims.iss !== 'accounts.google.com') ||
      typeof claims.aud !== 'string' || claims.aud !== cfg.clientId ||
      (claims.azp !== undefined && claims.azp !== cfg.clientId) ||
      !Number.isInteger(claims.exp) || claims.exp <= seconds ||
      !Number.isInteger(claims.iat) || claims.iat > seconds + 60 ||
      claims.nonce !== expectedNonce ||
      claims.email_verified !== true ||
      !Object.prototype.hasOwnProperty.call(IDLAB_ALLOWED, email) ||
      typeof claims.sub !== 'string' || !claims.sub || claims.sub.length > 255) idlabFail_();
  return {email: email, sub: claims.sub};
}

function completeIdentityLogin(browserSecret, state, code) {
  if (!idlabValidRandom_(browserSecret) || !idlabValidRandom_(state) ||
      typeof code !== 'string' || !code || code.length > 4096 || /[\x00-\x20\x7f]/.test(code)) idlabFail_();
  const cfg = idlabConfig_();
  const cache = CacheService.getScriptCache();
  const pending = idlabWithLock_(function () {
    const key = idlabPendingKey_(state);
    let stored;
    try { stored = JSON.parse(cache.get(key) || 'null'); } catch (_) { idlabFail_(); }
    if (!stored || stored.expiresAt <= Date.now() ||
        stored.browserDigest !== idlabDigest_(browserSecret) ||
        !idlabValidRandom_(stored.nonce) || !idlabValidRandom_(stored.verifier)) idlabFail_();
    cache.remove(key);
    return stored;
  });
  let response;
  try {
    response = UrlFetchApp.fetch(IDLAB_TOKEN_URL, {
      method: 'post',
      payload: {
        code: code,
        client_id: cfg.clientId,
        client_secret: cfg.clientSecret,
        redirect_uri: cfg.redirect,
        grant_type: 'authorization_code',
        code_verifier: pending.verifier
      },
      followRedirects: false,
      validateHttpsCertificates: true,
      muteHttpExceptions: true
    });
  } catch (_) { idlabFail_(); }
  if (response.getResponseCode() !== 200) idlabFail_();
  let result;
  try { result = JSON.parse(response.getContentText()); } catch (_) { idlabFail_(); }
  const identity = idlabReadClaimsFromDirectGoogleResponse_(result.id_token, cfg, pending.nonce);
  const session = {email: identity.email, sub: identity.sub, expiresAt: Date.now() + IDLAB_SESSION_TTL_MS};
  idlabWithLock_(function () {
    PropertiesService.getScriptProperties().setProperty(idlabSessionKey_(browserSecret), JSON.stringify(session));
  });
  // Never return the Google ID/access token or an owner OAuth token to the browser.
  return {success: true};
}

function validateIdentitySession_(browserSecret) {
  if (!idlabValidRandom_(browserSecret)) idlabFail_();
  const p = PropertiesService.getScriptProperties();
  const key = idlabSessionKey_(browserSecret);
  let record;
  try { record = JSON.parse(p.getProperty(key) || 'null'); } catch (_) { idlabFail_(); }
  if (!record || !Number.isSafeInteger(record.expiresAt) || record.expiresAt <= Date.now() ||
      typeof record.sub !== 'string' || !record.sub ||
      !Object.prototype.hasOwnProperty.call(IDLAB_ALLOWED, record.email)) idlabFail_();
  return {email: record.email, sub: record.sub};
}

