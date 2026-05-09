package com.clinic.opd.dto;

import com.clinic.opd.entity.Appointment;

import java.time.LocalDateTime;

public class AppointmentResponse {

    private Long id;
    private Long patientId;
    private String patientName;
    private String doctorName;
    private LocalDateTime dateTime;
    private Appointment.Status status;

    public static AppointmentResponse from(Appointment a) {
        AppointmentResponse dto = new AppointmentResponse();
        dto.id = a.getId();
        dto.patientId = a.getPatient().getId();
        dto.patientName = a.getPatient().getName();
        dto.doctorName = a.getDoctorName();
        dto.dateTime = a.getDateTime();
        dto.status = a.getStatus();
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public LocalDateTime getDateTime() { return dateTime; }
    public void setDateTime(LocalDateTime dateTime) { this.dateTime = dateTime; }

    public Appointment.Status getStatus() { return status; }
    public void setStatus(Appointment.Status status) { this.status = status; }
}
