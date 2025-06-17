package pe.edu.utp.gestionacademicautp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cache")
@RequiredArgsConstructor
public class CacheController {
    private final RedisTemplate<String, Object> redisTemplate;

    @PostMapping("/set")
    public String setCache(@RequestParam String key, @RequestParam String value) {
        redisTemplate.opsForValue().set(key, value);
        return "OK";
    }

    @GetMapping("/get")
    public Object getCache(@RequestParam String key) {
        return redisTemplate.opsForValue().get(key);
    }
}
