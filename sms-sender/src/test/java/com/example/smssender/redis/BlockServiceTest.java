package com.example.smssender.redis;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.SetOperations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class BlockServiceTest {

    private StringRedisTemplate redisTemplate;
    private SetOperations<String, String> setOps;
    private BlockService blockService;

    @BeforeEach
    public void setup() {
        redisTemplate = mock(StringRedisTemplate.class);
        setOps = mock(SetOperations.class);
        when(redisTemplate.opsForSet()).thenReturn(setOps);
        blockService = new BlockService(redisTemplate);
    }

    @Test
    public void testIsBlockedTrue() {
        when(setOps.isMember("blocked_users", "+14155552671")).thenReturn(true);
        assertTrue(blockService.isBlocked("+14155552671"));
    }

    @Test
    public void testIsBlockedFalse() {
        when(setOps.isMember("blocked_users", "+14155552671")).thenReturn(false);
        assertFalse(blockService.isBlocked("+14155552671"));
    }

    @Test
    public void testRedisExceptionHandled() {
        when(setOps.isMember("blocked_users", "+14155552671")).thenThrow(new RuntimeException("redis down"));
        assertFalse(blockService.isBlocked("+14155552671"));
    }
}
