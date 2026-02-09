package com.example.smssender.controller;

import com.example.smssender.dto.SmsRequest;
import com.example.smssender.service.SmsService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/v1/sms")
public class SmsController {

    private static final Logger logger = LoggerFactory.getLogger(SmsController.class);

    @Autowired
    private SmsService smsService;

    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> send(@RequestBody SmsRequest req) {
        try {
            if (req == null || req.userId == null || req.phoneNumber == null || req.message == null) {
                Map<String, Object> error = new HashMap<>();
                error.put("status", "ERROR");
                error.put("message", "Missing required fields");
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
