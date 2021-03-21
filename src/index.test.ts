import axios from 'axios';
import * as crypto from 'crypto';

import Iris from '.';
import IrisDataRequestDTO from './types/dto/IrisDataRequestDTO';
import IrisContactsEvents from './types/IrisContactsEvents';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('index', () => {
  let privateKey: string;
  let publicKey: string;
  let dataRequest: IrisDataRequestDTO;
  const submission: IrisContactsEvents = {
    contacts: {
      contactPersons: [],
      dataProvider: {
        firstName: 'Hans',
        lastName: 'Müller',
      },
    },
    events: {
      events: [],
      dataProvider: {
        firstName: 'Hans',
        lastName: 'Müller',
      },
    },
  };
  beforeAll((done) => {
    mockedAxios.create.mockImplementation(() => {
      return mockedAxios;
    });
    crypto.generateKeyPair(
      'rsa',
      {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
          cipher: 'aes-256-cbc',
          passphrase: 'top secret',
        },
      },
      (err, pub, priv) => {
        publicKey = pub;
        privateKey = priv;
        dataRequest = {
          healthDepartment: 'Test Health Department',
          key: Buffer.from(publicKey, 'utf-8').toString('base64'),
          keyReferenz: 'random-string-keyref',
          start: '2011-10-05T14:48:00.000Z',
          end: '2021-10-05T14:48:00.000Z',
        };
        done(err);
      },
    );
  });
  it('provides the Iris class', () => {
    expect(new Iris({})).toBeDefined();
  });

  it('can retrieve a data request and send a corresponding data submission', async () => {
    mockedAxios.get.mockResolvedValue({ status: 200, data: dataRequest });

    const iris = new Iris({});
    const dataRequestResult = await iris.getDataRequest('12345-abcde');
    expect(dataRequestResult).toEqual({
      healthDepartment: 'Test Health Department',
      start: '2011-10-05T14:48:00.000Z',
      end: '2021-10-05T14:48:00.000Z',
    });
    expect(mockedAxios.get).toHaveBeenCalledWith('/data-requests/12345-abcde');

    mockedAxios.post.mockResolvedValue({ status: 201, data: { success: true } });
    await iris.sendContactsEvents('12345-abcde', submission, {
      firstName: 'Hans',
      lastName: 'Müller',
      birthDate: '1963-01-05T14:48:00.000Z',
    });
    expect(mockedAxios.post).toHaveBeenCalledWith('/data-submissions/12345-abcde/contacts_events', {
      checkCode: [expect.any(String), expect.any(String)],
      secret: expect.any(String),
      keyReferenz: 'random-string-keyref',
      encryptedData: expect.any(String),
      nonce: expect.any(String),
    });
    const submittedData = mockedAxios.post.mock.calls[0][1];

    expect(submittedData.checkCode[0]).toEqual(crypto.createHash('md5').update('hansmller').digest('base64'));
    expect(submittedData.checkCode[1]).toEqual(crypto.createHash('md5').update('19630105').digest('base64'));

    const symmetricKey = crypto.privateDecrypt(
      { key: privateKey, passphrase: 'top secret' },
      Buffer.from(submittedData.secret, 'base64'),
    );
    const decipher = crypto.createDecipheriv('AES-256-CBC', symmetricKey, Buffer.from(submittedData.nonce, 'base64'));
    let receivedPlaintext = decipher.update(submittedData.encryptedData, 'base64', 'utf8');
    receivedPlaintext += decipher.final();
    expect(JSON.parse(receivedPlaintext)).toEqual(submission);
  });
});
