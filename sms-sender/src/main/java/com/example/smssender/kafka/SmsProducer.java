package com.example.smssender.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class SmsProducer {

    private static final Logger logger = LoggerFactory.getLogger(SmsProducer.class);

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void send(Object payload) {
        try {
            kafkaTemplate.send("sms-events", payload);
        } catch (Exception e) {
            logger.error("Failed to publish message to Kafka", e);
            throw new RuntimeException("Kafka publish failed", e);
        }
    }
}
