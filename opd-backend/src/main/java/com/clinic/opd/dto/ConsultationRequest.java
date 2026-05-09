package com.clinic.opd.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ConsultationRequest {

    @NotNull(message = "appointmentId is required")
    private Long appointmentId;

    @NotBlank(message = "bloodPressure is required")
    private String bloodPressure;

    @NotBlank(message = "temperature is required")
    private String temperature;

    @NotBlank(message = "notes are required")
    @Size(min = 5, message = "notes must be at least 5 characters")
    private String notes;

    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }

    public String getBloodPressure() { return bloodPressure; }
    public void setBloodPressure(String bloodPressure) { this.bloodPressure = bloodPressure; }

    public String getTemperature() { return temperature; }
    public void setTemperature(String temperature) { this.temperature = temperature; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
