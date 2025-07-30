// types/appointment.ts
export interface Appointment {
  slotId: string;
  doctorId: string;
  doctorName: string;
  startTime: string;
  endTime: string;
  status: string;
  patientId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const APPOINTMENT_API = import.meta.env.VITE_APPOINTMENT_API; //https://localhost:7074/api

class AppointmentService {
  async getPatientAppointments(patientId: string): Promise<Appointment[]> {
    try {
      const response = await fetch(`${APPOINTMENT_API}/Appointment/patient/${patientId}`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Appointment[]> = await response.json();
      
      if (!result.success) {
        throw new Error('API request failed');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching patient appointments:', error);
      throw error;
    }
  }
}

export const appointmentService = new AppointmentService();