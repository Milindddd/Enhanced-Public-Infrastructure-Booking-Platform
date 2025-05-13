package com.booking.service;

import com.booking.model.Booking;
import com.stripe.model.PaymentIntent;

public interface PaymentService {
    PaymentIntent createPaymentIntent(Booking booking) throws Exception;

    PaymentIntent confirmPayment(String paymentIntentId) throws Exception;

    PaymentIntent cancelPayment(String paymentIntentId) throws Exception;

    PaymentIntent getPaymentIntent(String paymentIntentId) throws Exception;
}