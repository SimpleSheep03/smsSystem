package com.example.smssender.controller;

import com.example.smssender.redis.BlockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/blocked")
public class BlockController {

    @Autowired
    private BlockService blockService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> list() {
        return ResponseEntity.ok(Map.of("blocked", blockService.listBlocked()));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> add(@RequestBody Map<String, String> body) {
        String phone = body.get("phoneNumber");
        if (phone == null || phone.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("status", "ERROR", "message", "phoneNumber required"));
        }
        boolean ok = blockService.addBlocked(phone);
        return ResponseEntity.ok(Map.of("added", ok));
    }

    @DeleteMapping("/{phone}")
    public ResponseEntity<Map<String, Object>> remove(@PathVariable String phone) {
        boolean ok = blockService.removeBlocked(phone);
        return ResponseEntity.ok(Map.of("removed", ok));
    }
}
