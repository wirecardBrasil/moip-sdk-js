export default class MoipValidator {
  static get _eloBins () {
    return [
      '401178',
      '401179',
      '431274',
      '438935',
      '451416',
      '457393',
      '457631',
      '457632',
      '504175',
      '627780',
      '636297',
      '636368',
      '636369'
    ]
  }

  static get _eloBinRanges () {
    return [
      [506699, 506778],
      [509000, 509999],
      [650031, 650033],
      [650035, 650051],
      [650405, 650439],
      [650485, 650538],
      [650541, 650598],
      [650700, 650718],
      [650720, 650727],
      [650901, 650920],
      [651652, 651679],
      [655000, 655019],
      [655021, 655058]
    ]
  }

  static get _hiperBins () {
    return [
      '637095',
      '637612',
      '637599',
      '637609',
      '637568'
    ]
  }

  static get _hipercardBins () {
    return [
      '606282',
      '384100',
      '384140',
      '384160'
    ]
  }

  static get _masterCardRanges () {
    return [
      222100,
      272099
    ]
  }

  static _isInEloBinRanges (bin) {
    const numbin = parseInt(bin)
    for (let i = 0; i < this._eloBinRanges.length; i++) {
      const start = this._eloBinRanges[i][0]
      const end = this._eloBinRanges[i][1]
      if (numbin >= start && numbin <= end) return true
    }
    return false
  }

  static _isInMasterCardRanges (bin) {
    const numRange = parseInt(bin)
    for (let i = 0; i < this._masterCardRanges.length; i += 2) {
      const startingRange = this._masterCardRanges[i]
      const endingRange = this._masterCardRanges[i + 1]
      if (numRange >= startingRange && numRange <= endingRange) return true
    }
    return false
  }

  static normalizeCardNumber (creditCardNumber) {
    if (!creditCardNumber) {
      return creditCardNumber
    }
    creditCardNumber += ''
    return creditCardNumber.replace(/[\s+|\.|\-]/g, '')
  }

  static isValidNumber (creditCardNumber) {
    const cardNumber = this.normalizeCardNumber(creditCardNumber)
    const cardType = this.cardType(cardNumber)

    if (!cardType) {
      return false
    } else if (cardType.brand === 'HIPERCARD') {
      return true // There's no validation for hipercard.
    } else {
      // Luhn algorithm: http://en.wikipedia.org/wiki/Luhn_algorithm
      let checksum = 0
      for (let i = (2 - (cardNumber.length % 2)); i <= cardNumber.length; i += 2) {
        checksum += parseInt(cardNumber.charAt(i - 1), 10)
      }
      // Analyze odd digits in even length strings or even digits in odd length strings.
      for (let i = (cardNumber.length % 2) + 1; i < cardNumber.length; i += 2) {
        let digit = parseInt(cardNumber.charAt(i - 1), 10) * 2
        if (digit < 10) { checksum += digit } else { checksum += (digit - 9) }
      }
      if ((checksum % 10) === 0) {
        return true
      } else {
        return false
      }
    }
  }

  static isSecurityCodeValid (creditCardNumber, cvc) {
    const type = this.cardType(creditCardNumber)
    if (!type) {
      return false
    }

    const digits = (type.brand === 'AMEX') ? 4 : 3
    const regExp = new RegExp(`[0-9]{${digits}}`)
    return (!!cvc && cvc.length === digits && regExp.test(cvc))
  }

  static isExpiryDateValid (expiryMonth, expiryYear) {
    let month = parseInt(expiryMonth, 10)
    let year = parseInt(expiryYear, 10)

    if (month < 1 || month > 12) {
      return false
    }
    if ((year + '').length !== 2 && (year + '').length !== 4) {
      return false
    }
    if ((year + '').length === 2) {
      if (year > 80) {
        year = '19' + year
      } else {
        year = '20' + year
      }
    }
    if (year < 1000 || year >= 3000) {
      return false
    }
    return !this.isExpiredDate(month, year)
  }

  static isExpiredDate (expireMonth, year) {
    const now = new Date()
    const thisMonth = ('0' + (now.getMonth() + 1)).slice(-2)
    const thisYear = now.getFullYear()
    const month = ('0' + (expireMonth)).slice(-2)

    if (year.toString().length === 2) {
      if (year > 80) {
        return true
      } else {
        year = '20' + year
      }
    }
    const currentDate = thisYear + thisMonth
    const customerDate = year + month
    return parseInt(customerDate, 10) < parseInt(currentDate, 10)
  }

  static isValid (creditCard) {
    const {number, cvc, expirationMonth, expirationYear} = creditCard

    return this.isValidNumber(number) &&
      this.isSecurityCodeValid(number, cvc) &&
      this.isExpiryDateValid(expirationMonth, expirationYear)
  }

  static cardType (creditCardNumber, loose) {
    const cardNumber = this.normalizeCardNumber(creditCardNumber)
    const getBin = (cardNum) => cardNum.substring(0, 6)

    let brands = {
        VISA: {matches: (cardNum) => { return /^4(?:\d{18}|\d{15}|\d{12})$/.test(cardNum) }},
        MASTERCARD: {
          matches: (cardNum) => {
            return /^5[1-5]\d{14}$/.test(cardNum) ||
              (cardNum !== null && cardNum.length == 16 &&
                this._isInMasterCardRanges(getBin(cardNum)))
          }
        },
        AURA: {matches: (cardNum) => { return /^(5078\d{2})(\d{2})(\d{11})$/.test(cardNum) }},
        AMEX: {matches: (cardNum) => { return /^3[4,7]\d{13}$/.test(cardNum) }},
        DINERS: {matches: (cardNum) => { return /^3[0,6,8]\d{12}$/.test(cardNum) }},
        DISCOVER: {matches: (cardNum) => { return /^6[0,5]\d{14}$/.test(cardNum) }},
        HIPERCARD: {
          matches: (cardNum) => {
            return cardNum !== null &&
              (cardNum.length == 16 || cardNum.length == 19) &&
              this._hipercardBins.indexOf(getBin(cardNum)) > -1
          }
        },
        ELO: {
          matches: (cardNum) => {
            return cardNum !== null &&
              cardNum.length == 16 &&
              (this._eloBins.indexOf(getBin(cardNum)) > -1 ||
                this._isInEloBinRanges(getBin(cardNum)))
          }
        },
        HIPER: {
          matches: (cardNum) => {
            return cardNum !== null &&
              cardNum.length >= 6 &&
              this._hiperBins.indexOf(getBin(cardNum)) > -1
          }
        }

      },
      // for non-strict detections
      looseBrands = {
        VISA: {matches: (cardNum) => { return /^4\d{3}\d*$/.test(cardNum) }},
        MASTERCARD: {
          matches: (cardNum) => {
            return /^5[1-5]\d{4}\d*$/.test(cardNum) ||
              (cardNum !== null && cardNum.length == 16 &&
                this._isInMasterCardRanges(getBin(cardNum)))
          }
        },
        AURA: {matches: (cardNum) => { return /^50\d*$/.test(cardNum) }},
        AMEX: {matches: (cardNum) => { return /^3[4,7]\d{2}\d*$/.test(cardNum) }},
        DINERS: {matches: (cardNum) => { return /^3(?:0[0-5]|[68][0-9])+\d*$/.test(cardNum) }},
        DISCOVER: {matches: (cardNum) => { return /^6(?:5|011|4[4-9]|2212[6-9]|221[3-9]\d|22[2-8]\d\d|229[0-1]\d|2292[0-5])+\d*$/.test(cardNum) }},
        HIPERCARD: {
          matches: (cardNum) => {
            return cardNum !== null &&
              cardNum.length >= 6 &&
              this._hipercardBins.indexOf(getBin(cardNum)) > -1
          }
        },
        ELO: {
          matches: (cardNum) => {
            return cardNum !== null &&
              cardNum.length >= 6 &&
              (this._eloBins.indexOf(getBin(cardNum)) > -1 ||
                this._isInEloBinRanges(getBin(cardNum)))
          }
        },
        HIPER: {
          matches: (cardNum) => {
            return cardNum !== null &&
              cardNum.length >= 6 &&
              this._hiperBins.indexOf(getBin(cardNum)) > -1
          }
        }

      }

    if (loose) {
      brands = looseBrands
    }

    // order is mandatory:
    // a) VISA is identified by the broad prefix '4', shadowing more specific ELO prefixes
    // b) HIPERCARD has precendence over DINERS for prefix 3841 (loose check)
    if (brands.ELO.matches(cardNumber)) { return {brand: 'ELO'} }
    if (brands.AURA.matches(cardNumber)) { return {brand: 'AURA'} }
    if (brands.HIPER.matches(cardNumber)) { return {brand: 'HIPER'} }
    if (brands.VISA.matches(cardNumber)) { return {brand: 'VISA'} }
    if (brands.MASTERCARD.matches(cardNumber)) { return {brand: 'MASTERCARD'} }
    if (brands.AMEX.matches(cardNumber)) { return {brand: 'AMEX'} }
    if (brands.HIPERCARD.matches(cardNumber)) { return {brand: 'HIPERCARD'} }
    if (brands.DINERS.matches(cardNumber)) { return {brand: 'DINERS'} }
    if (brands.DISCOVER.matches(cardNumber)) { return {brand: 'DISCOVER'} }

    return null
  }
}
