import JSEncrypt from 'jsencrypt';
import MoipCreditCard from '../src/credit_card';

describe('MoipCreditCard', () => {
	let pubKey;
	let creditCard;
	let cc;

	beforeAll(() => {
		pubKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoBttaXwRoI1Fbcond5mS
7QOb7X2lykY5hvvDeLJelvFhpeLnS4YDwkrnziM3W00UNH1yiSDU+3JhfHu5G387
O6uN9rIHXvL+TRzkVfa5iIjG+ap2N0/toPzy5ekpgxBicjtyPHEgoU6dRzdszEF4
ItimGk5ACx/lMOvctncS5j3uWBaTPwyn0hshmtDwClf6dEZgQvm/dNaIkxHKV+9j
Mn3ZfK/liT8A3xwaVvRzzuxf09xJTXrAd9v5VQbeWGxwFcW05oJulSFjmJA9Hcmb
DYHJT+sG2mlZDEruCGAzCVubJwGY1aRlcs9AQc1jIm/l8JwH7le2kpk3QoX+gz0w
WwIDAQAB
-----END PUBLIC KEY-----`;

		creditCard = {
      number  : '4012001037141112',
      cvc     : '123',
      expMonth: '05',
      expYear : '18'
		};

	});
 
	describe('.hash', () => {
		it('succesfully generates hash if all properties are given', () => {
			const hash = MoipCreditCard.setPubKey(pubKey).setCreditCard(creditCard).hash();
			expect(hash).not.toBeUndefined();
			expect(hash).not.toBeNull();
	    });

	    it('does not generate a hash if any property is missing', () => {
	    	cc = MoipCreditCard.setPubKey(null)
	    		.setCreditCard(creditCard);
      		expect(cc.hash()).toBeNull();

      		cc = MoipCreditCard.setPubKey(pubKey)
      			.setCreditCard(Object.assign({}, creditCard, { number: null }));
      		expect(cc.hash()).toBeNull();

      		cc = MoipCreditCard.setPubKey(pubKey)
      			.setCreditCard(Object.assign({}, creditCard, { cvc: null }));
      		expect(cc.hash()).toBeNull();

      		cc = MoipCreditCard.setPubKey(pubKey)
      			.setCreditCard(Object.assign({}, creditCard, { expMonth: null }));
      		expect(cc.hash()).toBeNull();

      		cc = MoipCreditCard.setPubKey(pubKey)
      			.setCreditCard(Object.assign({}, creditCard, { expYear: null }));
      		expect(cc.hash()).toBeNull();
    	});
	});

	describe('.isValid', () => {
		beforeAll(() => {
			cc = MoipCreditCard.setPubKey(pubKey).setCreditCard(creditCard);
		});

		it('accepts a valid card', () => {
			expect(cc.isValid()).toEqual(true);
    	});

    	it('does NOT accept a card with an invalid number', () => {
    		cc.setCreditCard(Object.assign({}, creditCard, { number: '222222222222' }));
    		expect(cc.isValid()).toBe(false);
    	});

    	it('does NOT accept a card with a past expiration date', () => {
    		cc.setCreditCard(Object.assign({}, creditCard, { expYear: '2014' }));
    		expect(cc.isValid()).toBe(false);
    	});

    	it('does NOT accept a card if any property is missing', () => {
    		cc.setCreditCard(Object.assign({}, creditCard, { number: null }));
    		expect(cc.isValid()).toBe(false);

      		cc.setCreditCard(Object.assign({}, creditCard, { cvc: null }));
      		expect(cc.isValid()).toBe(false);

      		cc.setCreditCard(Object.assign({}, creditCard, { expMonth: null }));
      		expect(cc.isValid()).toBe(false);

      		cc.setCreditCard(Object.assign({}, creditCard, { expYear: null }));
      		expect(cc.isValid()).toBe(false);
    	});
  	});

  	describe('.cardType', () => {
  		it('identifies the cardType', () => {
  			const cardType = MoipCreditCard.setPubKey(pubKey).setCreditCard(creditCard).cardType();
      		expect(cardType).toEqual('VISA');
    	});
    
    	it('does NOT identify the cardType if number is missing', () => {
      		const cardType = MoipCreditCard.setPubKey(pubKey)
      			.setCreditCard(Object.assign({}, creditCard, {number: null}))
      			.cardType();

      		expect(cardType).toBeNull();
    	});
  	});

  	describe('property accessors', () => {
  		it('provides access to all properties', () => {
  			const cc = MoipCreditCard.setCreditCard(creditCard);
  			expect(cc.getCreditCard()).toEqual(creditCard);
    	});
  	});
});