export default class Encrypt {
  static setEncrypter (encrypter, name) {
    this.encrypter = encrypter
    this.encrypterName = name
  }

  static encrypt (value, pubKey) {
    if (!this.encrypter && !this.encrypterName && typeof JSEncrypt !== 'undefined') {
      this.encrypter = JSEncrypt
      this.encrypterName = 'js'
    }

    if (this.encrypter && this.encrypterName) {
      switch (this.encrypterName.toLowerCase()) {
        case 'js':
        case 'ionic':
        case 'node':
          return this.jsEncrypt(value, pubKey)
        case 'react-native':
          return this.reactNativeRsa(value, pubKey)
      }
    }

    return Promise.resolve(null)
  }

  static jsEncrypt (value, pubKey) {
    return new Promise((resolve) => {
      const jsEncrypt = new this.encrypter({default_key_size: 2048})
      jsEncrypt.setPublicKey(pubKey)
      return resolve(jsEncrypt.encrypt(value))
    })
  }

  static reactNativeRsa (value, pubKey) {
    return this.encrypter.encrypt(value, pubKey)
  }
}