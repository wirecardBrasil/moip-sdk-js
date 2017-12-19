'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _validator = require('./validator');

var _validator2 = _interopRequireDefault(_validator);

var _nodeRsa = require('node-rsa');

var _nodeRsa2 = _interopRequireDefault(_nodeRsa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MoipCreditCard = function () {
  function MoipCreditCard() {
    _classCallCheck(this, MoipCreditCard);
  }

  _createClass(MoipCreditCard, null, [{
    key: 'setCreditCard',
    value: function setCreditCard(creditCard) {
      if (creditCard) {
        this.creditCard = Object.assign(creditCard, {
          number: _validator2.default.normalizeCardNumber(creditCard.number)
        });
      }

      return this;
    }
  }, {
    key: 'getCreditCard',
    value: function getCreditCard() {
      return this.creditCard;
    }
  }, {
    key: 'setPubKey',
    value: function setPubKey(pubKey) {
      this.pubKey = pubKey;
      return this;
    }
  }, {
    key: 'hash',
    value: function hash() {
      var _creditCard = this.creditCard,
          number = _creditCard.number,
          cvc = _creditCard.cvc,
          expMonth = _creditCard.expMonth,
          expYear = _creditCard.expYear;


      if (!this.pubKey || !number || !cvc || !expMonth || !expYear) {
        return null;
      }

      var rsakey = new _nodeRsa2.default(this.pubKey, { encryptionScheme: 'pkcs1' });

      var toEncrypt = ['number=' + number, 'cvc=' + cvc, 'expirationMonth=' + expMonth, 'expirationYear=' + expYear].join('&');

      return rsakey.encrypt(toEncrypt, 'base64');
    }
  }, {
    key: 'isValid',
    value: function isValid() {
      return _validator2.default.isValid(this.creditCard);
    }
  }, {
    key: 'cardType',
    value: function cardType() {
      var type = _validator2.default.cardType(this.creditCard.number);
      return type ? type.brand : null;
    }
  }]);

  return MoipCreditCard;
}();

exports.default = MoipCreditCard;