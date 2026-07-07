package com.hotel.reservation.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Validation failed");
        body.put("fields", fieldErrors);
        body.put("status", 400);
        return ResponseEntity.badRequest().body(body);
    }

        @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(buildError(ex.getMessage(), 404));
    }

        @ExceptionHandler(RoomUnavailableException.class)
    public ResponseEntity<Map<String, Object>> handleRoomUnavailable(RoomUnavailableException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(buildError(ex.getMessage(), 409));
    }

        @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleBadArgument(IllegalArgumentException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(buildError(ex.getMessage(), 400));
    }

        @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericError(Exception ex) {
        // Log the real error server-side, but return a generic message to the client
        ex.printStackTrace();
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(buildError("An unexpected error occurred. Please try again later.", 500));
    }

    private Map<String, Object> buildError(String message, int status) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", message);
        body.put("status", status);
        return body;
    }
}
