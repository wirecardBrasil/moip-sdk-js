export default class Encrypt {
	static setEncrypter(encrypter, name) {
		this.encrypter = encrypter;
		this.encrypterName = name;
	}

	static encrypt(value, pubKey) {
		if (!this.encrypter && !this.encrypterName && typeof JSEncrypt !== 'undefined') {
      this.encrypter = JSEncrypt;
      this.encrypterName = 'js';
		}

		if(this.encrypter && this.encrypterName) {
			switch (this.encrypterName.toLowerCase()){
        case 'js':
          return this.jsEncrypt(value, pubKey);
          break;
				case 'node':
					return this.nodeRSA(value, pubKey);
					break;
        case 'react-native':
          return this.reactNativeRsa(value, pubKey);
          break;
			}
		}
	}

	static jsEncrypt(value, pubKey) {
    return new Promise((resolve) => {
      const jsEncrypt = new this.encrypter({ default_key_size: 2048 });
      jsEncrypt.setPublicKey(pubKey);
      return resolve(jsEncrypt.encrypt(value));
    });
	}

	static nodeRSA(value, pubKey) {
		return new Promise((resolve) => {
      const nodeRsa = new this.encrypter(pubKey);
			return resolve(nodeRsa.encrypt(value, 'base64'));
		});
	}

	static reactNativeRsa(value, pubKey) {
		return this.encrypter.encrypt(value, pubKey);
	}
}