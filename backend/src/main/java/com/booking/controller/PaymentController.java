package com.booking.controller;

import com.booking.model.Booking;
import com.booking.service.BookingService;
import com.booking.service.PaymentService;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;
    private final BookingService bookingService;

    @Autowired
    public PaymentController(PaymentService paymentService, BookingService bookingService) {
        this.paymentService = paymentService;
        this.bookingService = bookingService;
    }

    @PostMapping("/create-intent/{bookingId}")
    public ResponseEntity<Map<String, String>> createPaymentIntent(@PathVariable Long bookingId) {
        try {
            Booking booking = bookingService.getBookingById(bookingId)
                    .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

            PaymentIntent paymentIntent = paymentService.createPaymentIntent(booking);

            Map<String, String> response = new HashMap<>();
            response.put("clientSecret", paymentIntent.getClientSecret());
            response.put("paymentIntentId", paymentIntent.getId());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/confirm/{paymentIntentId}")
    public ResponseEntity<PaymentIntent> confirmPayment(@PathVariable String paymentIntentId) {
        try {
            PaymentIntent paymentIntent = paymentService.confirmPayment(paymentIntentId);
            return ResponseEntity.ok(paymentIntent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/cancel/{paymentIntentId}")
    public ResponseEntity<PaymentIntent> cancelPayment(@PathVariable String paymentIntentId) {
        try {
            PaymentIntent paymentIntent = paymentService.cancelPayment(paymentIntentId);
            return ResponseEntity.ok(paymentIntent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{paymentIntentId}")
    public ResponseEntity<PaymentIntent> getPaymentIntent(@PathVariable String paymentIntentId) {
        try {
            PaymentIntent paymentIntent = paymentService.getPaymentIntent(paymentIntentId);
            return ResponseEntity.ok(paymentIntent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}