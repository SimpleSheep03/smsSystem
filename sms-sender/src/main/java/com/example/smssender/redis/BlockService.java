package com.example.smssender.redis;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class BlockService {

    @Autowired
    private StringRedisTemplate redisTemplate;

    public boolean isBlocked(String userId) {
        return Boolean.TRUE.equals(
                redisTemplate.opsForSet().isMember("blocked_users", userId)
        );
    }
}
