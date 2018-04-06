import Encrypt from '../src/encrypt';

describe('Encrypt', () =>  {
  let encrypter;
  let pubKey;
  let value;
  let jsEncrypt;
  let nodeRSA;
  let reactNativeRsa;

  beforeAll(() => {
      encrypter = class RSA{};
      pubKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoBttaXwRoI1Fbcond5mS
7QOb7X2lykY5hvvDeLJelvFhpeLnS4YDwkrnziM3W00UNH1yiSDU+3JhfHu5G387
O6uN9rIHXvL+TRzkVfa5iIjG+ap2N0/toPzy5ekpgxBicjtyPHEgoU6dRzdszEF4
ItimGk5ACx/lMOvctncS5j3uWBaTPwyn0hshmtDwClf6dEZgQvm/dNaIkxHKV+9j
Mn3ZfK/liT8A3xwaVvRzzuxf09xJTXrAd9v5VQbeWGxwFcW05oJulSFjmJA9Hcmb
DYHJT+sG2mlZDEruCGAzCVubJwGY1aRlcs9AQc1jIm/l8JwH7le2kpk3QoX+gz0w
WwIDAQAB
-----END PUBLIC KEY-----`;
      value = 'test';
      jsEncrypt = jasmine.createSpy('jsEncrypt').and.callFake(function () {
          this.setPublicKey = jasmine.createSpy('setPublicKey');
          this.encrypt = jasmine.createSpy('encrypt').and.returnValue('#123');
          return this;
      });
      nodeRSA = jasmine.createSpy('nodeRSA').and.callFake(function () {
          this.encrypt = jasmine.createSpy('encrypt').and.returnValue('#123');
          return this;
      });
      nodeRSA = jasmine.createSpy('nodeRSA').and.callFake(function () {
          this.encrypt = jasmine.createSpy('encrypt').and.returnValue('#123');
          return this;
      });
      reactNativeRsa = {
          encrypt: jasmine.createSpy('encrypt').and.returnValue(Promise.resolve('#123'))
      };
  });

  it('set encrypter context and name', () => {
      Encrypt.setEncrypter(encrypter, 'ionic');

      expect(Encrypt.encrypter).toEqual(encrypter);
      expect(Encrypt.encrypterName).toEqual('ionic');
  });

  it('set value and pubKey, but not set encrypter', (done) => {
      Encrypt.setEncrypter(null, null);

      Encrypt.encrypt(value, pubKey).then((hash) => {
                expect(hash).toBe(null);
                done();
          });
  });

  it('set value and pubKey, but not set encrypter, use JSEncrypt global', (done) => {
      global.JSEncrypt = '';

      Encrypt.setEncrypter(null, null);

      Encrypt.encrypt(value, pubKey).then(() => {
          expect(Encrypt.encrypter).toEqual(JSEncrypt);
          expect(Encrypt.encrypterName).toEqual('js');
          done();
      });
  });

  it('use JSEncrypt', (done) => {
      global.JSEncrypt = jsEncrypt;

      Encrypt.setEncrypter(null, null);

      Encrypt.encrypt(value, pubKey).then((hash) => {
          expect(hash).toEqual('#123');

          expect(global.JSEncrypt).toHaveBeenCalledWith({ default_key_size: 2048 });
          expect(global.JSEncrypt.calls.first().object.setPublicKey).toHaveBeenCalledWith(pubKey);
          expect(global.JSEncrypt.calls.first().object.encrypt).toHaveBeenCalledWith(value);

          done();
      });
  });

  it('use nodeRSA', (done) => {
      Encrypt.setEncrypter(nodeRSA, 'node');

      Encrypt.encrypt(value, pubKey).then((hash) => {
          expect(hash).toEqual('#123');

          expect(nodeRSA).toHaveBeenCalledWith(pubKey);
          expect(nodeRSA.calls.first().object.encrypt).toHaveBeenCalledWith(value, 'base64');

          done();
      });
  });

  it('use reactNativeRsa', (done) => {
      Encrypt.setEncrypter(reactNativeRsa, 'react-native');

      Encrypt.encrypt(value, pubKey).then((hash) => {
          expect(hash).toEqual('#123');

          expect(reactNativeRsa.encrypt).toHaveBeenCalledWith(value, pubKey);

          done();
      });
  });
    
});