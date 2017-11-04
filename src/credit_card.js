import Validator from './validator';
import NodeRSA from 'node-rsa';

export default class CreditCard {
	static setCreditCard(creditCard) {
		if(creditCard) {
			this.creditCard = Object.assign(creditCard, {
				number: Validator.normalizeCardNumber(creditCard.number)
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

    	const rsakey = new NodeRSA(this.pubKey);

    	const toEncrypt = [
    		`number=${number}`,
    		`cvc=${cvc}`,
    		`expirationMonth=${expMonth}`,
    		`expirationYear=${expYear}`,
    	].join('&');

    	return rsakey.encrypt(toEncrypt, 'base64');
  	}

  	static isValid() {
  		return Validator.isValid(this.creditCard);
  	}

  	static cardType() {
    	const type =  Validator.cardType(this.creditCard.number);
    	return type ? type.brand : null;
  	}
}