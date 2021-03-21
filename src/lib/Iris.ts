import axios, { AxiosInstance } from 'axios';

import { encryptData } from './crypto';
import { getNameCheckHash, getBirthDateCheckHash } from './util';

import IrisOptions from '../types/IrisOptions';
import IrisCode from '../types/IrisCode';
import IrisDataRequest from '../types/IrisDataRequest';
import IrisCodeKeyMap from '../types/IrisCodeKeyMap';
import IrisDataRequestDTO from '../types/dto/IrisDataRequestDTO';
import IrisContactsEvents from '../types/IrisContactsEvents';
import IrisContactsEventsSubmissionDTO from '../types/dto/IrisContactsEventsSubmissionDTO';
import IrisUserInfo from '../types/IrisUserInfo';

const defaultOptions: IrisOptions = {
  baseUrl: '',
};

export default class Iris {
  private axiosInstance: AxiosInstance;
  private codeKeyMap: IrisCodeKeyMap;

  constructor(options: Partial<IrisOptions>) {
    this.codeKeyMap = new Map();
    const opts: IrisOptions = Object.assign(defaultOptions, options);
    this.axiosInstance = axios.create({
      baseURL: opts.baseUrl,
    });
  }

  async getDataRequest(code: IrisCode): Promise<IrisDataRequest> {
    const response = await this.axiosInstance.get(`/data-requests/${code}`);
    if (response.status !== 200) {
      console.error('IRIS Gateway responded the following data', response.data);
      throw new Error(`Request failed with status Code ${response.status}`);
    }
    const dataRequest = response.data as IrisDataRequestDTO;
    this.codeKeyMap.set(code, {
      key: dataRequest.key,
      keyReferenz: dataRequest.keyReferenz,
    });
    return {
      healthDepartment: dataRequest.healthDepartment,
      start: dataRequest.start,
      end: dataRequest.end,
      requestDetails: dataRequest.requestDetails,
    };
  }

  async sendContactsEvents(code: IrisCode, data: IrisContactsEvents, user: IrisUserInfo): Promise<void> {
    if (!this.codeKeyMap.has(code)) {
      throw new Error("Code could not be found in key map. Did you perform 'getDataRequest' before?");
    }
    const keys = this.codeKeyMap.get(code);
    const { dataToTransport, keyToTransport, nonce } = encryptData(keys.key, data);
    const response = await this.axiosInstance.post(`/data-submissions/${code}/contacts_events`, {
      checkCode: [getNameCheckHash(user.firstName, user.lastName), getBirthDateCheckHash(user.birthDate)].filter(
        (c) => !!c,
      ),
      secret: keyToTransport,
      keyReferenz: keys.keyReferenz,
      encryptedData: dataToTransport,
      nonce,
    } as IrisContactsEventsSubmissionDTO);
    if (response.status !== 201) {
      console.error('IRIS Gateway responded the following data', response.data);
      throw new Error(`Request failed with status Code ${response.status}`);
    }
  }
}
