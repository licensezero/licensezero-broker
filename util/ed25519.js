const sodium = require('sodium-native')

// Wrap an implementation of Ed25519 in our own API,
// which expects and returns hex-encoded strings.

module.exports = {
  keys: () => {
    const publicKey = Buffer.alloc(32)
    const secretKey = Buffer.alloc(64)
    sodium.crypto_sign_keypair(publicKey, secretKey)
    return {
      privateKey: secretKey.toString('hex'),
      publicKey: publicKey.toString('hex')
    }
  },

  sign: (message, publicKey, privateKey) => {
    const signature = Buffer.alloc(64)
    sodium.crypto_sign_detached(
      signature,
      Buffer.from(message, 'utf8'),
      Buffer.from(privateKey, 'hex')
    )
    return signature.toString('hex')
  },

  verify: (message, signature, publicKey) => {
    return sodium.crypto_sign_verify_detached(
      Buffer.from(signature, 'hex'),
      Buffer.from(message, 'utf8'),
      Buffer.from(publicKey, 'hex')
    )
  }
}
