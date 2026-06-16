import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import { useAuth } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import { useCart } from "../store/cart";
import { apiFetch } from "../lib/api";

function CheckoutReturnPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const clear = useCart((s) => s.clear);

  const checkoutId = searchParams.get("checkout_id");
  const [status, setStatus] = useState("confirming");
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    if (!checkoutId) {
      setStatus("error");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await apiFetch("/api/checkout/confirm", {
          getToken,
          method: "POST",
          body: { checkoutId },
        });

        if (cancelled) return;

        if (res?.status === "paid") {
          clear();
          queryClient.invalidateQueries({ queryKey: ["orders"] });
          setStatus("paid");
          setTimeout(() => navigate("/orders", { replace: true }), 1800);
        } else {
          // Payment not registered yet; the webhook may still complete it.
          clear();
          setStatus("pending");
          setTimeout(() => navigate("/orders", { replace: true }), 2500);
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [checkoutId, getToken, clear, queryClient, navigate]);

  if (status === "error") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <XCircleIcon className="size-16 text-error" aria-hidden />
        <h1 className="text-2xl font-bold text-base-content">We couldn't confirm your order</h1>
        <p className="max-w-md text-base-content/70">
          Your payment may still be processing. Check your orders in a moment.
        </p>
        <Link to="/orders" className="btn btn-primary">
          Go to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <CheckCircleIcon className="size-16 text-success" aria-hidden />
      <h1 className="text-2xl font-bold text-base-content">
        {status === "paid" ? "Payment successful!" : "Finishing up…"}
      </h1>
      <p className="text-base-content/70">
        {status === "paid"
          ? "Your order has been placed. Redirecting to your orders…"
          : "Confirming your payment. Redirecting to your orders…"}
      </p>
      <span className="loading loading-dots loading-md text-primary" aria-hidden />
    </div>
  );
}

export default CheckoutReturnPage;
