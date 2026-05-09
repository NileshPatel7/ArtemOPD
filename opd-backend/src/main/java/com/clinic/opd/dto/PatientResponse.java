package com.clinic.opd.dto;

import com.clinic.opd.entity.Patient;

import java.time.LocalDateTime;

public class PatientResponse {

    private Long id;
    private String name;
    private Patient.Gender gender;
    private Integer age;
    private String phone;
    private LocalDateTime createdAt;

    public static PatientResponse from(Patient p) {
        PatientResponse dto = new PatientResponse();
        dto.id = p.getId();
        dto.name = p.getName();
        dto.gender = p.getGender();
        dto.age = p.getAge();
        dto.phone = p.getPhone();
        dto.createdAt = p.getCreatedAt();
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Patient.Gender getGender() { return gender; }
    public void setGender(Patient.Gender gender) { this.gender = gender; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
