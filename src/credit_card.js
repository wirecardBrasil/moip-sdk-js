import MoipValidator from './validator'
import Encrypt from './encrypt'

export default class MoipCreditCard {
  static setEncrypter (encrypter, name) {
    Encrypt.setEncrypter(encrypter, name)
    return this
  }

  static setCreditCard (creditCard) {
    if (creditCard) {
      this.creditCard = Object.assign(creditCard, {
        number: MoipValidator.normalizeCardNumber(creditCard.number)
      })
    }

    return this
  }

  static getCreditCard () {
    return this.creditCard
  }

  static setPubKey (pubKey) {
    this.pubKey = pubKey
    return this
  }

  static hash () {
    const {number, cvc, expirationMonth, expirationYear} = this.creditCard

    if (!this.pubKey ||
      !number ||
      !cvc ||
      !expirationMonth ||
      !expirationYear) {
      return Promise.resolve(null)
    }

    const toEncrypt = [
      `number=${number}`,
      `cvc=${cvc}`,
      `expirationMonth=${expirationMonth}`,
      `expirationYear=${expirationYear}`,
    ].join('&')

    return Encrypt.encrypt(toEncrypt, this.pubKey)
  }

  static isValid () {
    return MoipValidator.isValid(this.creditCard)
  }

  static cardType () {
    const type = MoipValidator.cardType(this.creditCard.number)
    return type ? type.brand : null
  }
}