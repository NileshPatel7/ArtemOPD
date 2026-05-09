package com.clinic.opd.dto;

import com.clinic.opd.entity.Patient;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PatientRequest {

    @NotBlank(message = "name is required")
    private String name;

    @NotNull(message = "gender is required")
    private Patient.Gender gender;

    @NotNull(message = "age is required")
    @Min(value = 0, message = "age must be >= 0")
    private Integer age;

    @NotBlank(message = "phone is required")
    private String phone;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Patient.Gender getGender() { return gender; }
    public void setGender(Patient.Gender gender) { this.gender = gender; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
