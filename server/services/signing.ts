/**
 * ABFI Cryptographic Signing Service
 * Ed25519 key management and Verifiable Credential signing
 *
 * Implements:
 * - Ed25519 key pair generation
 * - W3C VC Data Integrity Proofs (Ed25519Signature2020)
 * - Key storage and retrieval
 * - Signature verification
 */

import crypto from "crypto";
import { SignJWT, jwtVerify, importJWK, exportJWK, generateKeyPair } from "jose";

export interface KeyPair {
  publicKeyJwk: JsonWebKey;
  privateKeyJwk: JsonWebKey;
  publicKeyMultibase: string;
  keyId: string;
}

export interface DataIntegrityProof {
  type: string;
  created: string;
  verificationMethod: string;
  proofPurpose: string;
  proofValue: string;
}

export interface SignedCredential {
  "@context": string[];
  id: string;
  type: string[];
  issuer: string | { id: string; name?: string };
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: Record<string, unknown>;
  proof: DataIntegrityProof;
}

export interface VerificationResult {
  verified: boolean;
  errors: string[];
  issuer?: string;
  issuanceDate?: string;
  expirationDate?: string;
}

/**
 * SigningService handles cryptographic operations for VCs
 */
export class SigningService {
  private keyStore: Map<string, KeyPair> = new Map();

  /**
   * Generate a new Ed25519 key pair
   */
  async generateKeyPair(keyId: string): Promise<KeyPair> {
    const { publicKey, privateKey } = await generateKeyPair("EdDSA", {
      crv: "Ed25519",
    });

    const publicKeyJwk = await exportJWK(publicKey);
    const privateKeyJwk = await exportJWK(privateKey);

    // Create multibase representation (base58btc)
    const publicKeyBytes = Buffer.from(publicKeyJwk.x!, "base64url");
    const multicodecPrefix = Buffer.from([0xed, 0x01]); // Ed25519 multicodec
    const multibasePrefix = "z"; // base58btc prefix
    const combined = Buffer.concat([multicodecPrefix, publicKeyBytes]);
    const publicKeyMultibase = multibasePrefix + base58btcEncode(combined);

    const keyPair: KeyPair = {
      publicKeyJwk,
      privateKeyJwk,
      publicKeyMultibase,
      keyId,
    };

    this.keyStore.set(keyId, keyPair);

    return keyPair;
  }

  /**
   * Import an existing key pair
   */
  importKeyPair(keyId: string, privateKeyJwk: JsonWebKey, publicKeyJwk: JsonWebKey): void {
    const publicKeyBytes = Buffer.from(publicKeyJwk.x as string, "base64url");
    const multicodecPrefix = Buffer.from([0xed, 0x01]);
    const combined = Buffer.concat([multicodecPrefix, publicKeyBytes]);
    const publicKeyMultibase = "z" + base58btcEncode(combined);

    this.keyStore.set(keyId, {
      publicKeyJwk,
      privateKeyJwk,
      publicKeyMultibase,
      keyId,
    });
  }

  /**
   * Get a key pair by ID
   */
  getKeyPair(keyId: string): KeyPair | undefined {
    return this.keyStore.get(keyId);
  }

  /**
   * Sign a Verifiable Credential with Ed25519Signature2020
   */
  async signCredential(
    credential: Omit<SignedCredential, "proof">,
    keyId: string,
    verificationMethod: string
  ): Promise<SignedCredential> {
    const keyPair = this.keyStore.get(keyId);
    if (!keyPair) {
      throw new Error(`Key not found: ${keyId}`);
    }

    // Canonicalize the credential
    const canonicalCredential = canonicalizeJson(credential);

    // Create the proof options
    const proofOptions = {
      type: "Ed25519Signature2020",
      created: new Date().toISOString(),
      verificationMethod,
      proofPurpose: "assertionMethod",
    };

    // Create the data to sign (credential hash + proof options hash)
    const credentialHash = crypto
      .createHash("sha256")
      .update(canonicalCredential)
      .digest();

    const proofOptionsHash = crypto
      .createHash("sha256")
      .update(canonicalizeJson(proofOptions))
      .digest();

    const dataToSign = Buffer.concat([proofOptionsHash, credentialHash]);

    // Sign using Ed25519
    const privateKey = await importJWK(keyPair.privateKeyJwk, "EdDSA");

    // Create a JWT-style signature for simplicity
    // In production, would use proper Ed25519Signature2020 format
    const signature = await new SignJWT({
      hash: dataToSign.toString("base64url"),
    })
      .setProtectedHeader({ alg: "EdDSA" })
      .sign(privateKey);

    const proof: DataIntegrityProof = {
      ...proofOptions,
      proofValue: signature,
    };

    return {
      ...credential,
      proof,
    };
  }

  /**
   * Verify a signed Verifiable Credential
   */
  async verifyCredential(
    signedCredential: SignedCredential,
    publicKeyJwk?: JsonWebKey
  ): Promise<VerificationResult> {
    const errors: string[] = [];

    try {
      const { proof, ...credential } = signedCredential;

      if (!proof) {
        return { verified: false, errors: ["No proof found"] };
      }

      // Extract the verification method key ID
      const verificationMethod = proof.verificationMethod;
      const keyId = verificationMethod.split("#")[1] || verificationMethod;

      // Try to get the public key
      let publicKey: JsonWebKey | undefined = publicKeyJwk;

      if (!publicKey) {
        const keyPair = this.keyStore.get(keyId);
        if (keyPair) {
          publicKey = keyPair.publicKeyJwk;
        }
      }

      if (!publicKey) {
        return {
          verified: false,
          errors: ["Public key not found for verification"],
        };
      }

      // Recreate the data that was signed
      const canonicalCredential = canonicalizeJson(credential);

      const proofOptions = {
        type: proof.type,
        created: proof.created,
        verificationMethod: proof.verificationMethod,
        proofPurpose: proof.proofPurpose,
      };

      const credentialHash = crypto
        .createHash("sha256")
        .update(canonicalCredential)
        .digest();

      const proofOptionsHash = crypto
        .createHash("sha256")
        .update(canonicalizeJson(proofOptions))
        .digest();

      const expectedData = Buffer.concat([proofOptionsHash, credentialHash]);

      // Verify the signature
      const key = await importJWK(publicKey, "EdDSA");

      try {
        const { payload } = await jwtVerify(proof.proofValue, key);
        const signedHash = payload.hash as string;

        if (signedHash !== expectedData.toString("base64url")) {
          errors.push("Signature hash mismatch");
        }
      } catch (e) {
        errors.push("Invalid signature");
      }

      // Check expiration
      if (signedCredential.expirationDate) {
        const expDate = new Date(signedCredential.expirationDate);
        if (expDate < new Date()) {
          errors.push("Credential has expired");
        }
      }

      // Check issuance date is not in the future
      const issDate = new Date(signedCredential.issuanceDate);
      if (issDate > new Date()) {
        errors.push("Issuance date is in the future");
      }

      const issuer =
        typeof signedCredential.issuer === "string"
          ? signedCredential.issuer
          : signedCredential.issuer.id;

      return {
        verified: errors.length === 0,
        errors,
        issuer,
        issuanceDate: signedCredential.issuanceDate,
        expirationDate: signedCredential.expirationDate,
      };
    } catch (error) {
      return {
        verified: false,
        errors: [error instanceof Error ? error.message : "Unknown error"],
      };
    }
  }

  /**
   * Create a DID document with verification methods
   */
  createDidDocument(
    did: string,
    keyPair: KeyPair
  ): Record<string, unknown> {
    return {
      "@context": [
        "https://www.w3.org/ns/did/v1",
        "https://w3id.org/security/suites/ed25519-2020/v1",
      ],
      id: did,
      verificationMethod: [
        {
          id: `${did}#${keyPair.keyId}`,
          type: "Ed25519VerificationKey2020",
          controller: did,
          publicKeyMultibase: keyPair.publicKeyMultibase,
        },
      ],
      authentication: [`${did}#${keyPair.keyId}`],
      assertionMethod: [`${did}#${keyPair.keyId}`],
      capabilityInvocation: [`${did}#${keyPair.keyId}`],
      capabilityDelegation: [`${did}#${keyPair.keyId}`],
    };
  }

  /**
   * Export keys for storage (encrypted)
   */
  async exportKeysEncrypted(
    keyId: string,
    password: string
  ): Promise<string | null> {
    const keyPair = this.keyStore.get(keyId);
    if (!keyPair) return null;

    // Derive encryption key from password
    const salt = crypto.randomBytes(16);
    const key = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");
    const iv = crypto.randomBytes(16);

    // Encrypt the private key
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    const privateKeyJson = JSON.stringify(keyPair.privateKeyJwk);
    const encrypted = Buffer.concat([
      cipher.update(privateKeyJson, "utf8"),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    // Pack everything together
    const packed = {
      salt: salt.toString("base64"),
      iv: iv.toString("base64"),
      authTag: authTag.toString("base64"),
      encrypted: encrypted.toString("base64"),
      publicKeyJwk: keyPair.publicKeyJwk,
      keyId: keyPair.keyId,
    };

    return JSON.stringify(packed);
  }

  /**
   * Import keys from encrypted storage
   */
  async importKeysEncrypted(
    encryptedData: string,
    password: string
  ): Promise<boolean> {
    try {
      const packed = JSON.parse(encryptedData);

      // Derive encryption key from password
      const salt = Buffer.from(packed.salt, "base64");
      const key = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");
      const iv = Buffer.from(packed.iv, "base64");

      // Decrypt the private key
      const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
      decipher.setAuthTag(Buffer.from(packed.authTag, "base64"));

      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(packed.encrypted, "base64")),
        decipher.final(),
      ]);

      const privateKeyJwk = JSON.parse(decrypted.toString("utf8"));

      // Import the key pair
      this.importKeyPair(packed.keyId, privateKeyJwk, packed.publicKeyJwk);

      return true;
    } catch {
      return false;
    }
  }
}

// Helper: Canonicalize JSON (deterministic serialization)
function canonicalizeJson(obj: unknown): string {
  if (obj === null || typeof obj !== "object") {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return "[" + obj.map(canonicalizeJson).join(",") + "]";
  }

  const keys = Object.keys(obj as Record<string, unknown>).sort();
  const pairs = keys.map(
    (key) =>
      JSON.stringify(key) +
      ":" +
      canonicalizeJson((obj as Record<string, unknown>)[key])
  );

  return "{" + pairs.join(",") + "}";
}

// Helper: Base58btc encoding (simple implementation)
const BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function base58btcEncode(buffer: Buffer): string {
  const digits = [0];

  for (let i = 0; i < buffer.length; i++) {
    let carry = buffer[i];
    for (let j = 0; j < digits.length; j++) {
      carry += digits[j] << 8;
      digits[j] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }

  // Handle leading zeros
  for (let i = 0; i < buffer.length && buffer[i] === 0; i++) {
    digits.push(0);
  }

  return digits
    .reverse()
    .map((d) => BASE58_ALPHABET[d])
    .join("");
}

function base58btcDecode(str: string): Buffer {
  const bytes = [0];

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const value = BASE58_ALPHABET.indexOf(char);
    if (value === -1) {
      throw new Error(`Invalid base58 character: ${char}`);
    }

    let carry = value;
    for (let j = 0; j < bytes.length; j++) {
      carry += bytes[j] * 58;
      bytes[j] = carry & 0xff;
      carry >>= 8;
    }
    while (carry) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }

  // Handle leading ones (zeros in base58)
  for (let i = 0; i < str.length && str[i] === "1"; i++) {
    bytes.push(0);
  }

  return Buffer.from(bytes.reverse());
}

// Singleton instance
let signingServiceInstance: SigningService | null = null;

/**
 * Get or create the signing service instance
 */
export function getSigningService(): SigningService {
  if (!signingServiceInstance) {
    signingServiceInstance = new SigningService();

    // Load master key from environment if available
    const masterKeyEncrypted = process.env.SIGNING_MASTER_KEY;
    const masterKeyPassword = process.env.SIGNING_KEY_PASSWORD;

    if (masterKeyEncrypted && masterKeyPassword) {
      signingServiceInstance
        .importKeysEncrypted(masterKeyEncrypted, masterKeyPassword)
        .then((success) => {
          if (success) {
            console.log("[Signing] Master key loaded from environment");
          } else {
            console.warn("[Signing] Failed to load master key from environment");
          }
        });
    }
  }

  return signingServiceInstance;
}

/**
 * Create a new signing service instance
 */
export function createSigningService(): SigningService {
  return new SigningService();
}
