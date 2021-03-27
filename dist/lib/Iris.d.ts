import IrisOptions from '../types/IrisOptions';
import IrisCode from '../types/IrisCode';
import IrisDataRequest from '../types/IrisDataRequest';
import IrisContactsEvents from '../types/IrisContactsEvents';
import IrisUserInfo from '../types/IrisUserInfo';
export default class Iris {
    private axiosInstance;
    private codeKeyMap;
    /**
     * Generate an instance of the IRIS connector library
     *
     * @param options General settings like baseUrl
     */
    constructor(options: Partial<IrisOptions>);
    /**
     * Retrieve the data request and relevant information of the requesting health office
     *
     * @param code The code tied to the data request
     * @returns Data Request
     */
    getDataRequest(code: IrisCode): Promise<IrisDataRequest>;
    /**
     * Sends Contact and event information to IRIS
     *
     * @param code The code tied to the data request
     * @param data Data to be sent
     * @param user Information about the user sending the data
     */
    sendContactsEvents(code: IrisCode, data: IrisContactsEvents, user: IrisUserInfo): Promise<void>;
}
