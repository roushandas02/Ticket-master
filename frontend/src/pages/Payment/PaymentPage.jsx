import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import axios from "axios";

const VITE_STRIPE_PUBLISHABLE_KEY="pk_test_51T0UDZDqZDVEZDcpUxxygy8EPIDAUSTISYpjX8KLMQGAThE0jD25zs1JMFz7M9jLweKIjPF6iRcAq9ytHfKL4bwt003e7K4hvr";
const stripePromise = loadStripe(
  VITE_STRIPE_PUBLISHABLE_KEY
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();

  const { eventId, amount, teamName, teamSize, teamMembers } =
    location.state;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    try {
      const { data } = await api.post(
        "/payment/create-payment-intent",
        { amount }
      );

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        await api.post("/event-registration/team", {
          eventId,
          teamName,
          teamSize,
          teamMembers,
          paymentId: result.paymentIntent.id,
        });

        navigate("/dashboard");
      }
    } catch (err) {
      setError("Payment failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Complete Payment</h2>
      <p style={styles.subtitle}>Secure payment powered by Stripe</p>

      <div style={styles.amountBox}>
        <span>Total Amount</span>
        <strong>₹{amount}</strong>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.cardElementWrapper}>
          <CardElement options={cardStyle} />
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <button
          type="submit"
          disabled={!stripe || loading}
          style={styles.payButton}
        >
          {loading ? "Processing..." : `Pay ₹${amount}`}
        </button>
      </form>
    </div>
  );
};

const PaymentPage = () => (
  <div style={styles.page}>
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  </div>
);

const styles = {
  page: {
    minHeight: "100vh",
    minWidth: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(circle at top left, #1e3a8a, #0f172a 60%)",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "480px",
    background: "rgba(17, 24, 39, 0.9)",
    borderRadius: "20px",
    padding: "35px",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(144, 202, 249, 0.3)",
    boxShadow: "0 30px 60px rgba(0, 0, 0, 0.6)",
    color: "#f8fafc",
  },
  title: {
    fontSize: "1.6rem",
    fontWeight: 700,
    marginBottom: "6px",
    color: "#90caf9",
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#94a3b8",
    marginBottom: "25px",
  },
  amountBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(59, 130, 246, 0.1)",
    padding: "14px 18px",
    borderRadius: "12px",
    marginBottom: "25px",
    fontSize: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  cardElementWrapper: {
    padding: "14px",
    borderRadius: "12px",
    background: "rgba(15, 23, 42, 0.6)",
    border: "1px solid rgba(144, 202, 249, 0.3)",
  },
  payButton: {
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#fff",
    fontWeight: 600,
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(37, 99, 235, 0.4)",
    transition: "all 0.3s ease",
  },
  error: {
    color: "#f87171",
    fontSize: "0.9rem",
  },
};

const cardStyle = {
  style: {
    base: {
      color: "#f8fafc",
      fontSize: "16px",
      "::placeholder": {
        color: "#94a3b8",
      },
    },
    invalid: {
      color: "#ef4444",
    },
  },
};

export default PaymentPage;




