import IrisDataRequestDTO from './dto/IrisDataRequestDTO';
declare type IrisDataRequest = Pick<IrisDataRequestDTO, 'healthDepartment' | 'start' | 'end' | 'requestDetails'>;
export default IrisDataRequest;
