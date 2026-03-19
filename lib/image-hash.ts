import crypto from 'crypto'

/**
 * Generates a SHA256 hash of a buffer.
 */
export const generateHash = (buffer: Buffer): string => {
  return crypto.createHash('sha256').update(buffer).digest('hex')
}
