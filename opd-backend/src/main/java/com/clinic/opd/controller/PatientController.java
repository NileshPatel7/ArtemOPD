package com.clinic.opd.controller;

import com.clinic.opd.dto.PatientRequest;
import com.clinic.opd.dto.PatientResponse;
import com.clinic.opd.service.PatientService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Patient REST API
 *
 * GET    /api/patients            – list all patients
 * GET    /api/patients/{id}       – get patient by ID
 * GET    /api/patients/search?query= – search by name or phone
 * POST   /api/patients            – create patient
 * PUT    /api/patients/{id}       – update patient
 * DELETE /api/patients/{id}       – delete patient
 */
@RestController
@RequestMapping("/api/patients")

public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
		super();
		this.patientService = patientService;
	}

	@GetMapping
    public ResponseEntity<List<PatientResponse>> getAll() {
        return ResponseEntity.ok(patientService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<PatientResponse>> search(@RequestParam String query) {
        return ResponseEntity.ok(patientService.search(query));
    }

    @PostMapping
    public ResponseEntity<PatientResponse> create(@Valid @RequestBody PatientRequest request) {
        PatientResponse created = patientService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PatientResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody PatientRequest request) {
        return ResponseEntity.ok(patientService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        patientService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
