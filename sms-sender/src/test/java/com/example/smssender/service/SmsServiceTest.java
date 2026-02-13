package com.example.smssender.service;

import com.example.smssender.kafka.SmsProducer;
import com.example.smssender.redis.BlockService;
import com.example.smssender.dto.SmsRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class SmsServiceTest {

    private BlockService blockService;
    private SmsProducer producer;
    private SmsService smsService;

    @BeforeEach
    public void setup() {
        blockService = mock(BlockService.class);
        producer = mock(SmsProducer.class);
        smsService = new SmsService(blockService, producer);
    }

    @Test
    public void testBlockedUser() {
        when(blockService.isBlocked("+14155552671")).thenReturn(true);

        SmsRequest req = new SmsRequest();
        req.setPhoneNumber("+14155552671");
        req.setMessage("hello");

        String result = smsService.sendSms(req);
        assertEquals("USER_BLOCKED", result);
        verify(producer, never()).send(any());
    }

    @Test
    public void testNotBlockedSendsEvent() {
        when(blockService.isBlocked("+14155552671")).thenReturn(false);

        SmsRequest req = new SmsRequest();
        req.setPhoneNumber("+14155552671");
        req.setMessage("  hello   world   ");

        String result = smsService.sendSms(req);
        assertTrue(result.equals("SENT") || result.equals("FAILED"));

        ArgumentCaptor<Map> captor = ArgumentCaptor.forClass(Map.class);
        verify(producer, times(1)).send(captor.capture());
        Map event = captor.getValue();
        assertEquals("+14155552671", event.get("userId"));
        assertEquals("+14155552671", event.get("phoneNumber"));
        assertEquals("hello world", event.get("message"));
    }
}
