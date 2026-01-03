export const ENV = {
  appId: process.env.VITE_APP_ID || "abfi-dev-app",
  cookieSecret: process.env.JWT_SECRET || "abfi-dev-jwt-secret-key-2024",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  // HeyGen AI Avatar Configuration
  heygenApiKey: process.env.HEYGEN_API_KEY ?? "",
  heygenAvatarId: process.env.HEYGEN_AVATAR_ID ?? "sam_australian_001",
  // myGovID OAuth Configuration
  myGovIdClientId: process.env.MYGOVID_CLIENT_ID ?? "",
  myGovIdClientSecret: process.env.MYGOVID_CLIENT_SECRET ?? "",
  myGovIdRedirectUri: process.env.MYGOVID_REDIRECT_URI ?? "http://localhost:3000/api/mygovid/callback",
  // myGovID endpoints (production vs test)
  myGovIdIssuer: process.env.MYGOVID_ISSUER ?? "https://auth.mygovid.gov.au",
  myGovIdAuthEndpoint: process.env.MYGOVID_AUTH_ENDPOINT ?? "https://auth.mygovid.gov.au/oauth2/authorize",
  myGovIdTokenEndpoint: process.env.MYGOVID_TOKEN_ENDPOINT ?? "https://auth.mygovid.gov.au/oauth2/token",
  myGovIdUserInfoEndpoint: process.env.MYGOVID_USERINFO_ENDPOINT ?? "https://auth.mygovid.gov.au/oauth2/userinfo",
  myGovIdJwksUri: process.env.MYGOVID_JWKS_URI ?? "https://auth.mygovid.gov.au/.well-known/jwks.json",
};
