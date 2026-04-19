/**
 * Appointment Details Modal Types
 */

export type AppointmentDetailsResponse = {
  id: string;
  appointmentTypeId: number;
  appointmentTypeName: string;
  name: string;
  description: string;
  notes: string;
  slot: string;
  locationType: string;
  address: string;
  latitude: number;
  longitude: number;
  status: string;
  patientId: string;
  doctorId: string;
  doctorName?: string;
  labPartnerId: string;
  medicalTestId: number | null;
  medicalTestCompletionStatus: string | null;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
};

export type FactoryProps = {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  onSuccess?: () => void;
};
