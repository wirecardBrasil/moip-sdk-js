Moip SDK JS
=============
[![Build Status](https://travis-ci.org/brunoosilva/moip-sdk-js.svg)](https://travis-ci.org/brunoosilva/moip-sdk-js) [![Coverage Status](https://coveralls.io/repos/github/brunoosilva/moip-sdk-js/badge.svg?branch=master)](https://coveralls.io/github/brunoosilva/moip-sdk-js?branch=master)

## What is?

This is library for validate and encrypt CrediCard and integration with Moip API avoiding import conflicts.

## Install

```
yarn add moip-sdk-js
// or
npm i moip-sdk-js
```

## Test

```
yarn test
// or
npm test
```

## Use

```
import { MoipValidator, MoipCreditCard } from 'moip-sdk-js';
// or
const { MoipValidator, MoipCreditCard } from 'moip-sdk-js';
```

## MoipValidator

### Validate Credit Card Number
``` javascript
const creditCardNumber = '4111111111111111';
MoipValidator.isValidNumber(creditCardNumber);	//return true
```

### Validate Card Verification Code (CVC)
``` javascript
const creditCardNumber = '4111111111111111';
const cvc = '123';
MoipValidator.isSecurityCodeValid(creditCardNumber, cvc);	//return true
```

### Validate Expire Date
``` javascript
const month = '10';
const year = '2020';
MoipValidator.isExpiryDateValid(month, years);	//return true
```

### Card types
``` javascript
MoipValidator.cardType('5105105105105100');    //return [Object]MASTERCARD
MoipValidator.cardType('4111111111111111');    //return [Object]VISA
MoipValidator.cardType('341111111111111');     //return [Object]AMEX
MoipValidator.cardType('30569309025904');      //return [Object]DINERS
MoipValidator.cardType('3841001111222233334'); //return [Object]HIPERCARD
MoipValidator.cardType('4514160123456789');    //return [Object]ELO
MoipValidator.cardType('6370950000000005');    //return [Object]HIPER
MoipValidator.cardType('9191919191919191');    //return [Object]null
```

## MoipCreditCard

### Encrypt Credit Card (HASH)
``` javascript
const creditCard = {
	number  : '4012001037141112',
	cvc     : '123',
	expMonth: '05',
	expYear : '18'
};

const pubKey = `-----BEGIN PUBLIC KEY-----...`;

const hash = MoipCreditCard.setPubKey(pubKey).setCreditCard(creditCard).hash(); // Hash Base64
```

### License

MIT