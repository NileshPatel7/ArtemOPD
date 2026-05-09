export interface Appointment {
  id?: number;
  patientId: number;
  patientName?: string;
  doctorName: string;
  dateTime: string;
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}
