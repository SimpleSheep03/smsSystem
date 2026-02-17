package com.example.smssender.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class SmsRequest {

    private String userId;

    @NotBlank(message = "phoneNumber is required")
    @Pattern(regexp = "^\\+[1-9][0-9]{8,14}$", message = "Invalid phone number format")
    private String phoneNumber;

    @NotBlank(message = "message is required")
    @Size(max = 320, message = "message must be at most 320 characters")
    private String message;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
