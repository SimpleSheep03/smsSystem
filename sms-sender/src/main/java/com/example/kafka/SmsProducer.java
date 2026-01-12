package com.example.kafka;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class SmsProducer {

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void send(Object payload) {
        kafkaTemplate.send("sms-events", payload);
    }
}
