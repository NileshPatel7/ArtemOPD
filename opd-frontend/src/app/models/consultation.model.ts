export interface Consultation {
  id?: number;
  appointmentId: number;
  patientId?: number;
  patientName?: string;
  doctorName?: string;
  bloodPressure: string;
  temperature: string;
  notes: string;
  status?: 'COMPLETED';
  createdAt?: string;
}
