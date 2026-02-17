package com.example.smssender.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class BlockRequest {

    @NotBlank(message = "phoneNumber required")
    @Pattern(
        regexp = "^\\+[1-9][0-9]{8,14}$",
        message = "Invalid phone number format"
    )
    private String phoneNumber;

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}