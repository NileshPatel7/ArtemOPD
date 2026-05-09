package com.clinic.opd.dto;

import com.clinic.opd.entity.Consultation;

import java.time.LocalDateTime;

public class ConsultationResponse {

    private Long id;
    private Long appointmentId;
    private Long patientId;
    private String patientName;
    private String doctorName;
    private String bloodPressure;
    private String temperature;
    private String notes;
    private Consultation.Status status;
    private LocalDateTime createdAt;

    public static ConsultationResponse from(Consultation c) {
        ConsultationResponse dto = new ConsultationResponse();
        dto.id = c.getId();
        dto.appointmentId = c.getAppointment().getId();
        dto.patientId = c.getAppointment().getPatient().getId();
        dto.patientName = c.getAppointment().getPatient().getName();
        dto.doctorName = c.getAppointment().getDoctorName();
        dto.bloodPressure = c.getBloodPressure();
        dto.temperature = c.getTemperature();
        dto.notes = c.getNotes();
        dto.status = c.getStatus();
        dto.createdAt = c.getCreatedAt();
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getBloodPressure() { return bloodPressure; }
    public void setBloodPressure(String bloodPressure) { this.bloodPressure = bloodPressure; }

    public String getTemperature() { return temperature; }
    public void setTemperature(String temperature) { this.temperature = temperature; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Consultation.Status getStatus() { return status; }
    public void setStatus(Consultation.Status status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
