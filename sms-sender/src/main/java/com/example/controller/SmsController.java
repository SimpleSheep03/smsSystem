package com.example.controller;

import com.example.dto.SmsRequest;
import com.example.service.SmsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/sms")
public class SmsController {

    @Autowired
    private SmsService smsService;

    @PostMapping("/send")
    public Map<String, String> send(@RequestBody SmsRequest req) {
        String status = smsService.sendSms(req);
        return Map.of("status", status);
    }
}
