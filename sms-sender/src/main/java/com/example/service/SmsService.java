package com.example.service;

import com.example.dto.SmsRequest;
import com.example.kafka.SmsProducer;
import com.example.redis.BlockService;

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

        String status = Math.random() > 0.5 ? "SUCCESS" : "FAIL";

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
