import MoipValidator from './validator';
import NodeRSA from 'node-rsa';

export default class MoipCreditCard {
	static setCreditCard(creditCard) {
		if(creditCard) {
			this.creditCard = Object.assign(creditCard, {
				number: MoipValidator.normalizeCardNumber(creditCard.number)
			});
		}

		return this;
	}

  static getCreditCard(){
    return this.creditCard;
  }

	static setPubKey(pubKey) {
		this.pubKey = pubKey;
		return this;
	}

	static hash() {
		const { number, cvc, expMonth, expYear } = this.creditCard;

    	if (!this.pubKey || 
    		!number || 
    		!cvc || 
    		!expMonth || 
    		!expYear) {
    		return null;
    	}

    	const rsakey = new NodeRSA(this.pubKey, { encryptionScheme: 'pkcs1' });

    	const toEncrypt = [
    		`number=${number}`,
    		`cvc=${cvc}`,
    		`expirationMonth=${expMonth}`,
    		`expirationYear=${expYear}`,
    	].join('&');

    	return rsakey.encrypt(toEncrypt, 'base64');
  	}

  	static isValid() {
  		return MoipValidator.isValid(this.creditCard);
  	}

  	static cardType() {
    	const type =  MoipValidator.cardType(this.creditCard.number);
    	return type ? type.brand : null;
  	}
}