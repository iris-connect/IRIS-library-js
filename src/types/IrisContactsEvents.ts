interface DataProvider {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
}
enum Sex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  UNKNOWN = 'UNKNOWN',
}
interface Address {
  street: string;
  houseNumber: string;
  zipCode: string;
  city: string;
}

enum ContactCategory {
  HIGH_RISK = 'HIGH_RISK',
  HIGH_RISK_MED = 'HIGH_RISK_MED',
  MEDIUM_RISK_MED = 'MEDIUM_RISK_MED',
  LOW_RISK = 'LOW_RISK',
  NO_RISK = 'NO_RISK',
}
interface ContactPerson {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  sex?: Sex;
  email?: string;
  phone?: string;
  mobilPhone?: string;
  address?: Address;
  workPlace?: {
    name?: string;
    pointOfContact?: string;
    phone?: string;
    address?: Address;
  };
  contactInformation?: {
    date?: string;
    contactCategory?: ContactCategory;
    basicConditions?: string;
  };
}

interface Event {
    name?: string;
    phone?: string;
    address?: Address;
    additionalInformation?: string;
}

interface ContactPersonList {
  contactPersons: Array<ContactPerson>;
  dataProvider?: DataProvider;
  startDate?: string;
  endDate?: string;
}

interface EventList {
    events: Array<Event>;
    dataProvider?: DataProvider;
    startDate?: string;
    endDate?: string;
  }

export default interface IrisContactsEvents {
  contacts: ContactPersonList;
  events: EventList;
}
