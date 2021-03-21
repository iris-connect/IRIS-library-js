import IrisDataRequestDTO from './dto/IrisDataRequestDTO';
import IrisCode from './IrisCode';

type IrisCodeKeyMap = Map<IrisCode, Pick<IrisDataRequestDTO, 'key' | 'keyReferenz'>>;
export default IrisCodeKeyMap;
