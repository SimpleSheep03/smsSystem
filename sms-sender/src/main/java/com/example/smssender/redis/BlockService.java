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

    // Constructors for easier testing
    public BlockService() {}

    public BlockService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

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

    public boolean addBlocked(String phoneNumber) {
        try {
            Long added = redisTemplate.opsForSet().add("blocked_users", phoneNumber);
            return added != null && added > 0;
        } catch (Exception e) {
            logger.error("Error adding to blocklist: {}", phoneNumber, e);
            return false;
        }
    }

    public boolean removeBlocked(String phoneNumber) {
        try {
            Long removed = redisTemplate.opsForSet().remove("blocked_users", phoneNumber);
            return removed != null && removed > 0;
        } catch (Exception e) {
            logger.error("Error removing from blocklist: {}", phoneNumber, e);
            return false;
        }
    }

    public java.util.Set<String> listBlocked() {
        try {
            return redisTemplate.opsForSet().members("blocked_users");
        } catch (Exception e) {
            logger.error("Error listing blocklist", e);
            return java.util.Collections.emptySet();
        }
    }
}
