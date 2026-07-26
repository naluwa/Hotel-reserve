package com.hotel.reservation.controller;

import com.hotel.reservation.dto.GuestMessageRequest;
import com.hotel.reservation.exception.GlobalExceptionHandler;
import com.hotel.reservation.model.GuestMessage;
import com.hotel.reservation.security.JwtAuthenticationFilter;
import com.hotel.reservation.security.JwtTokenProvider;
import com.hotel.reservation.service.CustomUserDetailsService;
import com.hotel.reservation.service.GuestMessageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(GuestMessageController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class GuestMessageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GuestMessageService guestMessageService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void createMessage_returnsBadRequestForInvalidPayload() throws Exception {
        mockMvc.perform(post("/api/messages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "senderName": "Ada",
                                  "senderEmail": "ada@example.com",
                                  "subject": "Hi"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createMessage_acceptsSenderAliasFields() throws Exception {
        GuestMessage savedMessage = GuestMessage.builder()
                .id("msg-1")
                .senderName("Ada")
                .senderEmail("ada@example.com")
                .subject("Hello")
                .message("Hi there")
                .build();

        when(guestMessageService.createMessage(any(GuestMessageRequest.class))).thenReturn(savedMessage);

        mockMvc.perform(post("/api/messages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "senderName": "Ada",
                                  "senderEmail": "ada@example.com",
                                  "subject": "Hello",
                                  "message": "Hi there"
                                }
                                """))
                .andExpect(status().isCreated());
    }
}
