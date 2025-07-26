/**
 * Payment utility functions for Stripe integration
 */

import { loadStripe } from "@stripe/stripe-js";
import { PAYMENT_ENDPOINTS } from "./constants";
import api from "./api";

// Initialize Stripe with your publishable key
// You should add this to your environment variables
const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export interface CreateCheckoutSessionRequest {
	course_id: string;
}

export interface CreateCheckoutSessionResponse {
	checkout_session_id: string;
}

/**
 * Create a Stripe checkout session for course enrollment
 * @param courseId - The ID of the course to enroll in
 * @returns Promise with checkout session ID
 */
export const createCheckoutSession = async (
	courseId: string
): Promise<CreateCheckoutSessionResponse> => {
	try {
		const response = await api.post<CreateCheckoutSessionResponse>(
			PAYMENT_ENDPOINTS.CREATE_CHECKOUT,
			{
				course_id: courseId,
			}
		);

		return response.data;
	} catch (error) {
		console.error("Error creating checkout session:", error);
		throw error;
	}
};

/**
 * Redirect to Stripe checkout page using Stripe.js
 * @param checkoutSessionId - The checkout session ID from Stripe
 */
export const redirectToCheckout = async (
	checkoutSessionId: string
): Promise<void> => {
	try {
		const stripe = await stripePromise;
		if (!stripe) {
			throw new Error("Stripe failed to load");
		}

		// Redirect to Stripe Checkout
		const { error } = await stripe.redirectToCheckout({
			sessionId: checkoutSessionId,
		});

		if (error) {
			console.error("Stripe checkout error:", error);
			throw new Error(error.message || "Checkout failed");
		}
	} catch (error) {
		console.error("Error redirecting to checkout:", error);
		throw error;
	}
};

/**
 * Complete payment flow - create session and redirect
 * @param courseId - The ID of the course to enroll in
 */
export const initiatePayment = async (courseId: string): Promise<void> => {
	try {
		const { checkout_session_id } = await createCheckoutSession(courseId);
		await redirectToCheckout(checkout_session_id);
	} catch (error) {
		console.error("Payment initiation failed:", error);
		throw error;
	}
};
