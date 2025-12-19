import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

const AES_ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12
const KEY_LENGTH = 32
const SECRET_ENV = 'CARD_ENCRYPTION_KEY'

class CryptoConfigError extends Error {}

function decodeKey(rawKey?: string | null) {
  if (!rawKey) {
    throw new CryptoConfigError(`${SECRET_ENV} is not set`)
  }

  if (rawKey.startsWith('base64:')) {
    return Buffer.from(rawKey.slice(7), 'base64')
  }

  if (rawKey.startsWith('hex:')) {
    return Buffer.from(rawKey.slice(4), 'hex')
  }

  return Buffer.from(rawKey, 'utf8')
}

export function getEncryptionKey() {
  const key = decodeKey(process.env[SECRET_ENV])
  if (key.length !== KEY_LENGTH) {
    throw new CryptoConfigError(`${SECRET_ENV} must be 32 bytes after decoding`)
  }
  return key
}

// AIDEV-CRITICAL: AES-256-GCM with random IV; payload is base64(iv:ciphertext:tag)
export function encryptCardNumber(cardNumber: string) {
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(AES_ALGORITHM, getEncryptionKey(), iv)
  const encrypted = Buffer.concat([cipher.update(cardNumber, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  return [iv, encrypted, authTag].map((part) => part.toString('base64')).join(':')
}

export function decryptCardNumber(payload: string) {
  const parts = payload.split(':')
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted payload')
  }

  const [ivB64, contentB64, tagB64] = parts
  const iv = Buffer.from(ivB64, 'base64')
  const content = Buffer.from(contentB64, 'base64')
  const tag = Buffer.from(tagB64, 'base64')

  const decipher = createDecipheriv(AES_ALGORITHM, getEncryptionKey(), iv)
  decipher.setAuthTag(tag)
  const decrypted = Buffer.concat([decipher.update(content), decipher.final()])
  return decrypted.toString('utf8')
}

export function sanitizeCardNumber(raw: string) {
  return raw.replace(/\D+/g, '')
}

export function lastDigits(cardNumber: string, size = 4) {
  return cardNumber.slice(-size)
}
