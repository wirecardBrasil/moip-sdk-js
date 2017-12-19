'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MoipValidator = function () {
    function MoipValidator() {
        _classCallCheck(this, MoipValidator);
    }

    _createClass(MoipValidator, null, [{
        key: '_isInEloBinRanges',
        value: function _isInEloBinRanges(bin) {
            var numbin = parseInt(bin);
            for (var i = 0; i < this._eloBinRanges.length; i++) {
                var start = this._eloBinRanges[i][0];
                var end = this._eloBinRanges[i][1];
                if (numbin >= start && numbin <= end) return true;
            }
            return false;
        }
    }, {
        key: '_isInMasterCardRanges',
        value: function _isInMasterCardRanges(bin) {
            var numRange = parseInt(bin);
            for (var i = 0; i < this._masterCardRanges.length; i += 2) {
                var startingRange = this._masterCardRanges[i];
                var endingRange = this._masterCardRanges[i + 1];
                if (numRange >= startingRange && numRange <= endingRange) return true;
            }
            return false;
        }
    }, {
        key: 'normalizeCardNumber',
        value: function normalizeCardNumber(creditCardNumber) {
            if (!creditCardNumber) {
                return creditCardNumber;
            }
            creditCardNumber += '';
            return creditCardNumber.replace(/[\s+|\.|\-]/g, '');
        }
    }, {
        key: 'isValidNumber',
        value: function isValidNumber(creditCardNumber) {
            var cardNumber = this.normalizeCardNumber(creditCardNumber);
            var cardType = this.cardType(cardNumber);

            if (!cardType) {
                return false;
            } else if (cardType.brand === 'HIPERCARD') {
                return true; // There's no validation for hipercard.
            } else {
                // Luhn algorithm: http://en.wikipedia.org/wiki/Luhn_algorithm
                var checksum = 0;
                for (var i = 2 - cardNumber.length % 2; i <= cardNumber.length; i += 2) {
                    checksum += parseInt(cardNumber.charAt(i - 1), 10);
                }
                // Analyze odd digits in even length strings or even digits in odd length strings.
                for (var _i = cardNumber.length % 2 + 1; _i < cardNumber.length; _i += 2) {
                    var digit = parseInt(cardNumber.charAt(_i - 1), 10) * 2;
                    if (digit < 10) {
                        checksum += digit;
                    } else {
                        checksum += digit - 9;
                    }
                }
                if (checksum % 10 === 0) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }, {
        key: 'isSecurityCodeValid',
        value: function isSecurityCodeValid(creditCardNumber, cvc) {
            var type = this.cardType(creditCardNumber);
            if (!type) {
                return false;
            }

            var digits = type.brand === 'AMEX' ? 4 : 3;
            var regExp = new RegExp('[0-9]{' + digits + '}');
            return !!cvc && cvc.length === digits && regExp.test(cvc);
        }
    }, {
        key: 'isExpiryDateValid',
        value: function isExpiryDateValid(expiryMonth, expiryYear) {
            var month = parseInt(expiryMonth, 10);
            var year = parseInt(expiryYear, 10);

            if (month < 1 || month > 12) {
                return false;
            }
            if ((year + '').length !== 2 && (year + '').length !== 4) {
                return false;
            }
            if ((year + '').length === 2) {
                if (year > 80) {
                    year = '19' + year;
                } else {
                    year = '20' + year;
                }
            }
            if (year < 1000 || year >= 3000) {
                return false;
            }
            return !this.isExpiredDate(month, year);
        }
    }, {
        key: 'isExpiredDate',
        value: function isExpiredDate(expireMonth, year) {
            var now = new Date();
            var thisMonth = ('0' + (now.getMonth() + 1)).slice(-2);
            var thisYear = now.getFullYear();
            var month = ('0' + expireMonth).slice(-2);

            if (year.toString().length === 2) {
                if (year > 80) {
                    return true;
                } else {
                    year = '20' + year;
                }
            }
            var currentDate = thisYear + thisMonth;
            var customerDate = year + month;
            return parseInt(customerDate, 10) < parseInt(currentDate, 10);
        }
    }, {
        key: 'isValid',
        value: function isValid(creditCard) {
            var number = creditCard.number,
                cvc = creditCard.cvc,
                expMonth = creditCard.expMonth,
                expYear = creditCard.expYear;


            return this.isValidNumber(number) && this.isSecurityCodeValid(number, cvc) && this.isExpiryDateValid(expMonth, expYear);
        }
    }, {
        key: 'cardType',
        value: function cardType(creditCardNumber, loose) {
            var _this = this;

            var cardNumber = this.normalizeCardNumber(creditCardNumber);
            var getBin = function getBin(cardNum) {
                return cardNum.substring(0, 6);
            };

            var brands = {
                VISA: { matches: function matches(cardNum) {
                        return (/^4\d{15}$/.test(cardNum)
                        );
                    } },
                MASTERCARD: { matches: function matches(cardNum) {
                        return (/^5[1-5]\d{14}$/.test(cardNum) || cardNum !== null && cardNum.length == 16 && _this._isInMasterCardRanges(getBin(cardNum))
                        );
                    } },
                AMEX: { matches: function matches(cardNum) {
                        return (/^3[4,7]\d{13}$/.test(cardNum)
                        );
                    } },
                DINERS: { matches: function matches(cardNum) {
                        return (/^3[0,6,8]\d{12}$/.test(cardNum)
                        );
                    } },
                HIPERCARD: { matches: function matches(cardNum) {
                        return cardNum !== null && (cardNum.length == 16 || cardNum.length == 19) && _this._hipercardBins.indexOf(getBin(cardNum)) > -1;
                    } },
                ELO: { matches: function matches(cardNum) {
                        return cardNum !== null && cardNum.length == 16 && (_this._eloBins.indexOf(getBin(cardNum)) > -1 || _this._isInEloBinRanges(getBin(cardNum)));
                    } },
                HIPER: { matches: function matches(cardNum) {
                        return cardNum !== null && cardNum.length >= 6 && _this._hiperBins.indexOf(getBin(cardNum)) > -1;
                    } }

            },

            // for non-strict detections
            looseBrands = {
                VISA: { matches: function matches(cardNum) {
                        return (/^4\d{3}\d*$/.test(cardNum)
                        );
                    } },
                MASTERCARD: { matches: function matches(cardNum) {
                        return (/^5[1-5]\d{4}\d*$/.test(cardNum) || cardNum !== null && cardNum.length == 16 && _this._isInMasterCardRanges(getBin(cardNum))
                        );
                    } },
                AMEX: { matches: function matches(cardNum) {
                        return (/^3[4,7]\d{2}\d*$/.test(cardNum)
                        );
                    } },
                DINERS: { matches: function matches(cardNum) {
                        return (/^3(?:0[0-5]|[68][0-9])+\d*$/.test(cardNum)
                        );
                    } },
                HIPERCARD: { matches: function matches(cardNum) {
                        return cardNum !== null && cardNum.length >= 6 && _this._hipercardBins.indexOf(getBin(cardNum)) > -1;
                    } },
                ELO: { matches: function matches(cardNum) {
                        return cardNum !== null && cardNum.length >= 6 && (_this._eloBins.indexOf(getBin(cardNum)) > -1 || _this._isInEloBinRanges(getBin(cardNum)));
                    } },
                HIPER: { matches: function matches(cardNum) {
                        return cardNum !== null && cardNum.length >= 6 && _this._hiperBins.indexOf(getBin(cardNum)) > -1;
                    } }

            };

            if (loose) {
                brands = looseBrands;
            }

            // order is mandatory:
            // a) VISA is identified by the broad prefix '4', shadowing more specific ELO prefixes
            // b) HIPERCARD has precendence over DINERS for prefix 3841 (loose check)
            if (brands.ELO.matches(cardNumber)) {
                return { brand: 'ELO' };
            }
            if (brands.HIPER.matches(cardNumber)) {
                return { brand: 'HIPER' };
            }
            if (brands.VISA.matches(cardNumber)) {
                return { brand: 'VISA' };
            }
            if (brands.MASTERCARD.matches(cardNumber)) {
                return { brand: 'MASTERCARD' };
            }
            if (brands.AMEX.matches(cardNumber)) {
                return { brand: 'AMEX' };
            }
            if (brands.HIPERCARD.matches(cardNumber)) {
                return { brand: 'HIPERCARD' };
            }
            if (brands.DINERS.matches(cardNumber)) {
                return { brand: 'DINERS' };
            }

            return null;
        }
    }, {
        key: '_eloBins',
        get: function get() {
            return ['401178', '401179', '431274', '438935', '451416', '457393', '457631', '457632', '504175', '627780', '636297', '636368'];
        }
    }, {
        key: '_eloBinRanges',
        get: function get() {
            return [[506699, 506778], [509000, 509999], [650031, 650033], [650035, 650051], [650405, 650439], [650485, 650538], [650541, 650598], [650700, 650718], [650720, 650727], [650901, 650920], [651652, 651679], [655000, 655019], [655021, 655058]];
        }
    }, {
        key: '_hiperBins',
        get: function get() {
            return ['637095', '637612', '637599', '637609', '637568'];
        }
    }, {
        key: '_hipercardBins',
        get: function get() {
            return ['606282', '384100', '384140', '384160'];
        }
    }, {
        key: '_masterCardRanges',
        get: function get() {
            return [222100, 272099];
        }
    }]);

    return MoipValidator;
}();

exports.default = MoipValidator;