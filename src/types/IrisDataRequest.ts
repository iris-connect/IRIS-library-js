import IrisDataRequestDTO from './dto/IrisDataRequestDTO';

type IrisDataRequest = Pick<IrisDataRequestDTO, 'healthDepartment' | 'start' | 'end' | 'requestDetails'>
export default IrisDataRequest
