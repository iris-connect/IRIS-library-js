import IrisOptions from '../types/IrisOptions';
import IrisCode from '../types/IrisCode';
import IrisDataRequest from '../types/IrisDataRequest';
import IrisContactsEvents from '../types/IrisContactsEvents';
import IrisUserInfo from '../types/IrisUserInfo';
export default class Iris {
    private axiosInstance;
    private codeKeyMap;
    constructor(options: Partial<IrisOptions>);
    getDataRequest(code: IrisCode): Promise<IrisDataRequest>;
    sendContactsEvents(code: IrisCode, data: IrisContactsEvents, user: IrisUserInfo): Promise<void>;
}
