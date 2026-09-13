import { ApplicationRecord } from '../types';

const STORAGE_KEY = 'piyush_travels_applications_v1';

export const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'PT-2026-7821',
    serviceId: 'aay-praman-patra',
    serviceName: 'Income Certificate (Aay Praman Patra)',
    serviceNameHi: 'आय प्रमाण पत्र (Income Certificate)',
    applicantName: 'Ramesh Kumar Sah',
    fatherHusbandName: 'Dinesh Sah',
    gender: 'Male',
    dob: '1998-05-12',
    mobileNumber: '7763890336',
    email: 'ramesh.sah@gmail.com',
    aadharNumber: 'XXXX-XXXX-4589',
    address: 'Ward No 04, Near Shiv Mandir, Bagahi Bazar',
    villageTown: 'Bagahi Bazar',
    postOffice: 'Bagahi',
    district: 'Gopalganj / Siwan',
    state: 'Bihar',
    pinCode: '841428',
    customData: {
      annualIncome: '95000',
      incomeSource: 'Agriculture (कृषि)',
    },
    documentsUploaded: [
      { name: 'Aadhaar_Card_Front_Back.pdf', type: 'application/pdf', size: '420 KB', uploadedAt: '12 Sep 2026' },
      { name: 'Passport_Photo.jpg', type: 'image/jpeg', size: '180 KB', uploadedAt: '12 Sep 2026' },
      { name: 'Self_Declaration_Form.pdf', type: 'application/pdf', size: '250 KB', uploadedAt: '12 Sep 2026' },
    ],
    paymentStatus: 'paid',
    paymentMethod: 'UPI (PhonePe)',
    transactionRef: 'UPI/20260912/7763890336',
    amountPaid: 60,
    submittedAt: '12 Sep 2026, 11:30 AM',
    expectedDate: '19 Sep 2026',
    status: 'processing',
    operatorNotes: 'Documents verified by Piyush Travels. Forwarded to RTPS Circle Officer.',
  },
  {
    id: 'PT-2026-6410',
    serviceId: 'new-pan-card',
    serviceName: 'New PAN Card (NSDL / UTI)',
    serviceNameHi: 'नया पैन कार्ड (New PAN Card Apply)',
    applicantName: 'Pooja Kumari',
    fatherHusbandName: 'Manoj Sharma',
    gender: 'Female',
    dob: '2004-08-20',
    mobileNumber: '9835012345',
    email: 'pooja.sharma2004@gmail.com',
    aadharNumber: 'XXXX-XXXX-8912',
    address: 'Main Market Road, Bagahi Bazar',
    villageTown: 'Bagahi Bazar',
    postOffice: 'Bagahi',
    district: 'Siwan',
    state: 'Bihar',
    pinCode: '841428',
    customData: {
      fatherNamePan: 'Manoj Sharma',
      panType: 'Physical Card + e-PAN (डाक + ईमेल दोनों)',
    },
    documentsUploaded: [
      { name: 'Aadhaar_Card.pdf', type: 'application/pdf', size: '510 KB', uploadedAt: '10 Sep 2026' },
      { name: 'Signature_Scan.png', type: 'image/png', size: '120 KB', uploadedAt: '10 Sep 2026' },
    ],
    paymentStatus: 'paid',
    paymentMethod: 'Google Pay',
    transactionRef: 'GPAY-98214-77638',
    amountPaid: 150,
    submittedAt: '10 Sep 2026, 03:15 PM',
    expectedDate: '14 Sep 2026',
    status: 'ready_for_pickup',
    operatorNotes: 'e-PAN generated successfully. Physical card dispatched via India Post.',
  },
  {
    id: 'PT-2026-3195',
    serviceId: 'railway-ticket',
    serviceName: 'Railway Ticket Booking (Tatkal & General IRCTC)',
    serviceNameHi: 'रेलवे टिकट बुकिंग (तत्काल व सामान्य)',
    applicantName: 'Md. Wasim',
    fatherHusbandName: 'Abdul Karim',
    gender: 'Male',
    dob: '1992-03-15',
    mobileNumber: '7763890336',
    email: 'razav75@gmail.com',
    aadharNumber: 'XXXX-XXXX-1120',
    address: 'Opposite Post Office, Bagahi Bazar',
    villageTown: 'Bagahi Bazar',
    postOffice: 'Bagahi',
    district: 'Gopalganj',
    state: 'Bihar',
    pinCode: '841428',
    customData: {
      trainFrom: 'Siwan Junction (SV)',
      trainTo: 'New Delhi (NDLS)',
      journeyDate: '2026-09-22',
      travelClass: '3rd AC (3A)',
      quota: 'General (सामान्य)',
    },
    documentsUploaded: [
      { name: 'ID_Proof_Aadhaar.pdf', type: 'application/pdf', size: '310 KB', uploadedAt: '13 Sep 2026' },
    ],
    paymentStatus: 'paid',
    paymentMethod: 'Paytm UPI',
    transactionRef: 'PAYTM-67182903',
    amountPaid: 60,
    submittedAt: '13 Sep 2026, 09:10 AM',
    expectedDate: '13 Sep 2026',
    status: 'completed',
    operatorNotes: 'IRCTC PNR: 245-8910245 (Coach B3, Berth 24 LB). Ticket sent to WhatsApp & Email.',
  }
];

export function getStoredApplications(): ApplicationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPLICATIONS));
      return INITIAL_APPLICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_APPLICATIONS;
  }
}

export function saveApplication(app: ApplicationRecord): void {
  try {
    const current = getStoredApplications();
    const updated = [app, ...current.filter(item => item.id !== app.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save application', err);
  }
}

export function updateApplicationStatus(id: string, status: ApplicationRecord['status'], notes?: string): void {
  try {
    const current = getStoredApplications();
    const updated = current.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status,
          operatorNotes: notes !== undefined ? notes : item.operatorNotes,
        };
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update application', err);
  }
}

export function generateApplicationId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `PT-2026-${randomNum}`;
}
