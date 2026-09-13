export type ServiceCategory =
  | 'all'
  | 'certificates'
  | 'identity'
  | 'schemes'
  | 'travel_insurance'
  | 'cyber_print'
  | 'land_revenue'
  | 'utility_banking';

export interface ServiceItem {
  id: string;
  name: string;
  nameHi: string;
  category: ServiceCategory;
  fee: number;
  govtFeeNote?: string;
  processingTime: string;
  processingTimeHi: string;
  requiredDocs: string[];
  requiredDocsHi: string[];
  icon: string;
  popular?: boolean;
  tag?: string;
  description: string;
  descriptionHi: string;
  customFields?: CustomFormField[];
}

export interface CustomFormField {
  id: string;
  label: string;
  labelHi: string;
  type: 'text' | 'number' | 'select' | 'date' | 'textarea';
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

export type ApplicationStatus =
  | 'submitted'
  | 'document_verified'
  | 'processing'
  | 'ready_for_pickup'
  | 'completed';

export interface ApplicationRecord {
  id: string; // e.g. PT-2026-4821
  serviceId: string;
  serviceName: string;
  serviceNameHi: string;
  applicantName: string;
  fatherHusbandName: string;
  gender: string;
  dob?: string;
  mobileNumber: string;
  email?: string;
  aadharNumber: string;
  address: string;
  villageTown: string;
  postOffice: string;
  blockPanchayat?: string;
  district: string;
  state: string;
  pinCode: string;
  customData: Record<string, string>;
  documentsUploaded: {
    name: string;
    type: string;
    size?: string;
    uploadedAt: string;
  }[];
  paymentStatus: 'paid' | 'pay_at_shop' | 'pending';
  paymentMethod?: string;
  transactionRef?: string;
  amountPaid: number;
  submittedAt: string;
  expectedDate: string;
  status: ApplicationStatus;
  operatorNotes?: string;
}
