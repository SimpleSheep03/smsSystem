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

    public String sendSms(SmsRequest req) {
        if (blockService.isBlocked(req.userId)) {
            return "USER_BLOCKED";
        }

        double probability = Math.random();
        String status = (probability < 0.5) ? "FAILED" : "SENT";

        Map<String, Object> event = new HashMap<>();
        event.put("userId", req.userId);
        event.put("phoneNumber", req.phoneNumber);
        event.put("message", req.message);
        event.put("status", status);
        event.put("timestamp", Instant.now().toString());

        producer.send(event);
        return status;
    }
}
