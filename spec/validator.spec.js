import MoipValidator from '../src/validator';

describe('MoipValidator', () =>  {
  let assertCard;

  beforeAll(() => {
    assertCard = (cardNumber, brand, loose = false) =>
      expect(MoipValidator.cardType(cardNumber, loose)).toEqual({ brand });
  });

  describe('.isValidNumber', () => {
    it('validates numeric format', () =>  {
      const valid = MoipValidator.isValidNumber(4111111111111111);
      expect(valid).toBe(true);
    });

    it('validates string format', () =>  {
      const valid = MoipValidator.isValidNumber('4111111111111111');
      expect(valid).toBe(true);
    });

    it('validates format w/ whitespace', () =>  {
      const valid = MoipValidator.isValidNumber('4111 1111 1111 1111');
      expect(valid).toBe(true);
    });

    it('validates format w/ dash', () =>  {
      const valid = MoipValidator.isValidNumber('4111-1111-1111-1111');
      expect(valid).toBe(true);
    });

    it('validates format w/ dot', () =>  {
      const valid = MoipValidator.isValidNumber('4111.1111.1111.1111');
      expect(valid).toBe(true);
    });

    it('recognizes an invalid number (Luhn)', () =>  {
      const valid = MoipValidator.isValidNumber(222222222222);
     expect(valid).toBe(false);
    });
  });

  describe('.isExpiredDate', () => {
    it('recognizes an expired date (long format)', () =>  {
      const valid = MoipValidator.isExpiredDate(5, 2013);
      expect(valid).toBe(true);
    });

    it('recognizes an expired date (short format)', () =>  {
      const valid = MoipValidator.isExpiredDate(5, 98);
      expect(valid).toBe(true);
    });

    it('recognizes a future date)', () =>  {
      const valid = MoipValidator.isExpiredDate(1, 42);
      expect(valid).toBe(false);
    });
  });

  describe('.isExpiryDateValid', () => {
    it('recognizes a valid date (numeric format)', () => {
      const valid = MoipValidator.isExpiryDateValid(5, 42);
      expect(valid).toBe(true);
    });

    it('recognizes a valid date (non numeric format)', () => {
      const valid = MoipValidator.isExpiryDateValid('5', '42');
      expect(valid).toBe(true);
    });

    it('recognizes an invalid date (expired)', () => {
      const valid = MoipValidator.isExpiryDateValid(5, 98);
      expect(valid).toBe(false);
    });

    it('recognizes an invalid date (non numeric format)', () => {
      const valid = MoipValidator.isExpiryDateValid('ab', 'cd');
      expect(valid).toBe(false);
    });
  });

  describe('.cardType', () => {

    describe('[strict mode]', () => {
      it('recognizes VISA', () => {
        assertCard('4111111111111111', 'VISA');
        assertCard('4024007190131', 'VISA');
      });

      it('recognizes MASTERCARD', () => {
        assertCard('5105105105105100', 'MASTERCARD');
      });

      it('recognizes AMEX', () => {
        assertCard('341111111111111', 'AMEX');
      });

      it('recognizes DINERS', () => {
        assertCard('36263526914736', 'DINERS');
      });

      it('recognizes AURA', () => [
          '5000000000000000', '5010000000000000', '5020000000000000',
          '5030000000000000', '5040000000000000', '5050000000000000',
          '5060000000000000', '5070000000000000', '5080000000000000',
          '5078601912345600019', '5078601800003247449', 5078601870000127985
        ].forEach(cardNumber => assertCard(cardNumber, 'AURA'))
      );

      it('recognizes ELO', () => {
        assertCard('4514160123456789', 'ELO');
        assertCard('5067700123456789', 'ELO');
        assertCard('5099990123456789', 'ELO');
        assertCard('6500320123456789', 'ELO');
        assertCard('6550210123456789', 'ELO');
      });

      it('recognizes HIPER', () => {
        assertCard('6370950000000005', 'HIPER');
      });

      it('recognizes HIPERCARD', () => {
        assertCard('6062829544380656', 'HIPERCARD');
        assertCard('3841001111222233334', 'HIPERCARD');
        assertCard('3841401111222233334', 'HIPERCARD');
        assertCard('3841601111222233334', 'HIPERCARD');
      });

      it('recognizes MASTERCARD new range', () => {
        assertCard('2221002857319036', 'MASTERCARD');
        assertCard('2572098765432123', 'MASTERCARD');
        assertCard('2720793872642452', 'MASTERCARD');
      });

      it('recognizes DISCOVER', () => [
        '6011236044609927', '6011091915358231', '6011726125958524',
        '6011111111111117', '6011000990139424', '6511020000245045'
      ].forEach(cardNumber => assertCard(cardNumber, 'DISCOVER'))
      );

    });


    describe('[loose mode]', () => {
      it('recognizes VISA', () => {
        assertCard('411111', 'VISA', true);
        assertCard('402400', 'VISA', true);
      });

      it('recognizes MASTERCARD', () => {
        assertCard('510510', 'MASTERCARD', true);
      });

      it('recognizes AMEX', () => {
        assertCard('341111', 'AMEX', true);
      });

      it('recognizes DINERS', () => {
        assertCard('305693', 'DINERS', true);
      });

      it('recognizes AURA', () => {
        assertCard('500000', 'AURA', true);
      });

      it('recognizes ELO', () => {
        assertCard('451416', 'ELO', true);
        assertCard('506770', 'ELO', true);
        assertCard('509999', 'ELO', true);
        assertCard('650032', 'ELO', true);
        assertCard('655021', 'ELO', true);
        assertCard('401178', 'ELO', true);
      });

      it('recognizes HIPER', () => {
        assertCard('637095', 'HIPER', true);
      });

      it('recognizes MASTERCARD new range', () => {
        assertCard('2221001231231232', 'MASTERCARD', true);
        assertCard('2572093213213213', 'MASTERCARD', true);
        assertCard('2720994564564566', 'MASTERCARD', true);
      })

      it('recognizes DISCOVER', () => {
        assertCard('601111', 'DISCOVER', true);
        assertCard('601100', 'DISCOVER', true);
        assertCard('601119', 'DISCOVER', true);
      });
    });
  });

  describe('.isSecurityCodeValid', () => {
    it('recognizes a valid 3 digit cvv', () => {
      const valid = MoipValidator.isSecurityCodeValid('5105105105105100', '123');
      expect(valid).toBe(true);
    });

    it('recognizes an invalid 4 digit cvv', () => {
      const valid = MoipValidator.isSecurityCodeValid('5105105105105100', '1234');
      expect(valid).toBe(false);
    });

    it('recognizes a valid 4 digit cvv (AMEX)', () => {
      const valid = MoipValidator.isSecurityCodeValid('341111111111111', '1234');
      expect(valid).toBe(true);
    });
  });

});
