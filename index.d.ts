declare module "moip-sdk-js" {
  enum CardType {
    ELO = "ELO",
    VISA = "VISA",
    AMEX = "AMEX",
    HIPER = "HIPER",
    DINERS = "DINERS",
    HIPERCARD = "HIPERCARD",
    MASTERCARD = "MASTERCARD",
  }

  type CreditCard = {
    cvc: string;
    number: string;
    expirationYear: string;
    expirationMonth: string;
  };

  interface IMCC {}
  interface IMoipCreditCard {
    new (): IMCC;
    hash(): Promise<string>;
    isValid(): boolean;
    cardType(): CardType | null;
    setPubKey(pubKey: string): IMoipCreditCard;
    setEncrypter(encrypter: unknown, name: string): IMoipCreditCard;
    getCreditCard(): CreditCard;
    setCreditCard(creditCard?: CreditCard): IMoipCreditCard;
  }

  interface IMV {}
  interface IMoipValidator {
    new (): IMV;
    cardType(
      creditCardNumber: number | string,
      loose?: boolean
    ): { brand: CardType } | null;

    isValid(creditCard: CreditCard): boolean;
    isValidNumber(creditCardNumber: number | string): boolean;
    isExpiredDate(month: number, year: number): boolean;
    isExpiryDateValid(month: number | string, year: number | string): boolean;
    isSecurityCodeValid(
      creditCardNumber: number | string,
      cvc: string
    ): boolean;
    normalizeCardNumber(creditCardNumber: string): string;
  }

  export const MoipValidator: IMoipValidator;
  export const MoipCreditCard: IMoipCreditCard;
}
