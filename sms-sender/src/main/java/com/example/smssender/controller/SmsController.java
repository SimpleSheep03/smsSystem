package com.example.smssender.controller;

import com.example.smssender.dto.SmsRequest;
import org.springframework.validation.BindingResult;
import jakarta.validation.Valid;
import com.example.smssender.service.SmsService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.regex.Pattern;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/v1/sms")
public class SmsController {

    private static final Logger logger = LoggerFactory.getLogger(SmsController.class);

    @Autowired
    private SmsService smsService;

    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> send(@Valid @RequestBody SmsRequest req, BindingResult br) {
        try {


            if (br.hasErrors()) {
                Map<String, Object> error = new HashMap<>();
                error.put("status", "ERROR");
                error.put("message", br.getFieldErrors().stream()
                        .map(f -> f.getField() + ": " + f.getDefaultMessage())
                        .reduce((a, b) -> a + "; " + b).orElse("Validation failed"));
                return ResponseEntity.badRequest().body(error);
            }

            String status = smsService.sendSms(req);
            return ResponseEntity.ok(Map.of("status", status));
        } catch (RuntimeException e) {
            logger.error("Error sending SMS", e);
            Map<String, Object> error = new HashMap<>();
            error.put("status", "ERROR");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
