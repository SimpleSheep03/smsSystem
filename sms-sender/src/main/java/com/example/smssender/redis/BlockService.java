package com.example.smssender.redis;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class BlockService {

    private static final Logger logger = LoggerFactory.getLogger(BlockService.class);

    @Autowired
    private StringRedisTemplate redisTemplate;

    public boolean isBlocked(String userId) {
        try {
            return Boolean.TRUE.equals(
                    redisTemplate.opsForSet().isMember("blocked_users", userId)
            );
        } catch (Exception e) {
            logger.error("Error checking Redis blocklist for userId: {}", userId, e);
            // Fail safely - assume not blocked if Redis is unavailable
            return false;
        }
    }
}
