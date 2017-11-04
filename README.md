Moip SDK Node
=============
[![Build Status](https://travis-ci.org/brunoosilva/moip-sdk-node.svg)](https://travis-ci.org/brunoosilva/moip-sdk-node) [![Coverage Status](https://coveralls.io/repos/brunoosilva/moip-sdk-node/badge.svg)](https://coveralls.io/r/brunoosilva/moip-sdk-node)

## What is?

This is library for validate and encrypt CrediCard and integration with Moip API.

## Install

```
yarn add moip-sdk-node
// or
npm i moip-sdk-node
```

## Test

```
yarn test
// or
npm test
```

## Use

```
import { Validator, CreditCard } from 'moip-sdk-node';
// or
const { Validator, CreditCard } from 'moip-sdk-node';
```

## Validator

### Validate Credit Card Number
``` javascript
const creditCardNumber = '4111111111111111';
Validator.isValidNumber(creditCardNumber);	//return true
```

### Validate Card Verification Code (CVC)
``` javascript
const creditCardNumber = '4111111111111111';
const cvc = '123';
Validator.isSecurityCodeValid(creditCardNumber, cvc);	//return true
```

### Validate Expire Date
``` javascript
const month = '10';
const year = '2020';
Validator.isExpiryDateValid(month, years);	//return true
```

### Card types
``` javascript
Validator.cardType('5105105105105100');    //return [Object]MASTERCARD
Validator.cardType('4111111111111111');    //return [Object]VISA
Validator.cardType('341111111111111');     //return [Object]AMEX
Validator.cardType('30569309025904');      //return [Object]DINERS
Validator.cardType('3841001111222233334'); //return [Object]HIPERCARD
Validator.cardType('4514160123456789');    //return [Object]ELO
Validator.cardType('6370950000000005');    //return [Object]HIPER
Validator.cardType('9191919191919191');    //return [Object]null
```

## CreditCard

### Encrypt Credit Card (HASH)
``` javascript
const creditCard = {
	number  : '4012001037141112',
	cvc     : '123',
	expMonth: '05',
	expYear : '18'
};

const pubKey = `-----BEGIN PUBLIC KEY-----...`;

const hash = CreditCard.setPubKey(pubKey).setCreditCard(creditCard).hash(); // Hash Base64
```

### License

MIT