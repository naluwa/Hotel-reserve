package com.hotel.reservation.controller;

import com.hotel.reservation.dto.GuestMessageRequest;
import com.hotel.reservation.model.GuestMessage;
import com.hotel.reservation.service.GuestMessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@Slf4j
public class GuestMessageController {

    private final GuestMessageService guestMessageService;

    @PostMapping
    public ResponseEntity<GuestMessage> createMessage(@Valid @RequestBody GuestMessageRequest request) {
        log.info("Guest message received from {}", request.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(guestMessageService.createMessage(request));
    }

    @GetMapping
    public ResponseEntity<List<GuestMessage>> getMessages() {
        return ResponseEntity.ok(guestMessageService.getAllMessages());
    }

    @GetMapping("/my")
    public ResponseEntity<List<GuestMessage>> getMyMessages(Authentication authentication) {
        return ResponseEntity.ok(guestMessageService.getMessagesForCustomer(authentication.getName()));
    }

    @PutMapping("/{id}/read")
    public GuestMessage markAsRead(@PathVariable String id) {
        return guestMessageService.markAsRead(id);
    }

    @PostMapping("/{id}/reply")
    public ResponseEntity<GuestMessage> replyToMessage(
            @PathVariable String id,
            @RequestBody Map<String, String> body,
            Authentication authentication
    ) {
        String replyText = body.get("reply");
        if (replyText == null || replyText.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        String repliedBy = authentication != null ? authentication.getName() : "Concierge";
        GuestMessage updated = guestMessageService.replyToMessage(id, replyText, repliedBy);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable String id) {
        if (id == null || id.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        guestMessageService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }
}
