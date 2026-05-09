package com.clinic.opd.controller;

import com.clinic.opd.dto.ConsultationRequest;
import com.clinic.opd.dto.ConsultationResponse;
import com.clinic.opd.service.ConsultationService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Consultation REST API
 *
 * GET    /api/consultations                           – list all consultations
 * GET    /api/consultations/appointment/{appointmentId} – get by appointment
 * GET    /api/consultations/patient/{patientId}       – list by patient
 * POST   /api/consultations                           – create consultation
 */
@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {

    private final ConsultationService consultationService;

	public ConsultationController(ConsultationService consultationService) {
		super();
		this.consultationService = consultationService;
	}

	@GetMapping
    public ResponseEntity<List<ConsultationResponse>> getAll() {
        return ResponseEntity.ok(consultationService.getAll());
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<ConsultationResponse> getByAppointment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(consultationService.getByAppointment(appointmentId));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<ConsultationResponse>> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(consultationService.getByPatient(patientId));
    }

    @PostMapping
    public ResponseEntity<ConsultationResponse> create(@Valid @RequestBody ConsultationRequest request) {
        ConsultationResponse created = consultationService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
