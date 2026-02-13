package com.example.smssender.service;

import com.example.smssender.dto.SmsRequest;
import com.example.smssender.kafka.SmsProducer;
import com.example.smssender.redis.BlockService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
public class SmsService {

    @Autowired
    private BlockService blockService;

    @Autowired
    private SmsProducer producer;

    // Constructors for easier testing
    public SmsService() {}

    public SmsService(BlockService blockService, SmsProducer producer) {
        this.blockService = blockService;
        this.producer = producer;
    }

    public String sendSms(SmsRequest req) {
        String identifier = req.getPhoneNumber();
        if (blockService.isBlocked(identifier)) {
            return "USER_BLOCKED";
        }

        // sanitize message: trim, collapse whitespace, and enforce max length
        String msg = req.getMessage() == null ? "" : req.getMessage().trim().replaceAll("\\s+", " ");
        int maxLen = 320;
        if (msg.length() > maxLen) {
            msg = msg.substring(0, maxLen);
        }

        double probability = Math.random();
        String status = (probability < 0.5) ? "FAILED" : "SENT";

        Map<String, Object> event = new HashMap<>();
        event.put("userId", identifier);
        event.put("phoneNumber", identifier);
        event.put("message", msg);
        event.put("status", status);
        event.put("timestamp", Instant.now().toString());

        producer.send(event);
        return status;
    }
}
