package com.example.smssender.controller;
import jakarta.validation.Valid;

import com.example.smssender.dto.BlockRequest;
import com.example.smssender.redis.BlockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/v1/blocked")
public class BlockController {

    private static final Logger logger = LoggerFactory.getLogger(SmsController.class);

    @Autowired
    private BlockService blockService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> list() {
        return ResponseEntity.ok(Map.of("blocked", blockService.listBlocked()));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> add(
            @Valid @RequestBody BlockRequest request , BindingResult br) {

        try{
            if(br.hasErrors()){
                Map<String, Object> error = new HashMap<>();
                error.put("status", "ERROR");
                error.put("message", br.getFieldErrors().stream()
                        .map(f -> f.getField() + ": " + f.getDefaultMessage())
                        .reduce((a, b) -> a + "; " + b).orElse("Validation failed"));
                return ResponseEntity.badRequest().body(error);
            }
            boolean ok = blockService.addBlocked(request.getPhoneNumber());
            return ResponseEntity.ok(Map.of("added", ok));
        }
        catch(RuntimeException e){
            logger.error("Error sending SMS", e);
            Map<String, Object> error = new HashMap<>();
            error.put("status", "ERROR");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }


    }

    @DeleteMapping("/{phone}")
    public ResponseEntity<Map<String, Object>> remove(@PathVariable String phone) {
        boolean ok = blockService.removeBlocked(phone);
        return ResponseEntity.ok(Map.of("removed", ok));
    }
}
