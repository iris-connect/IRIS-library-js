import IrisDataRequestDTO from './dto/IrisDataRequestDTO';
import IrisCode from './IrisCode';

type IrisCodeKeyMap = Map<IrisCode, Pick<IrisDataRequestDTO, 'keyOfHealthDepartment' | 'keyReferenz'>>;
export default IrisCodeKeyMap;
