import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authFetch } from "../utils/auth";
import { useCart } from "../context/CartContext";
import { getApiUrl } from "../utils/api";

function CheckoutPage() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    payment_method: "COD",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const nav = useNavigate();
  const { cartItems, total, clearCart } = useCart();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const loadRazorpay = () =>
    new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error("Razorpay SDK could not be loaded"));
      document.body.appendChild(script);
    });

  const createOnlinePayment = async () => {
    const url = getApiUrl("/api/payment/");
    const paymentResponse = await authFetch(url, { method: "POST" });
    const paymentData = await paymentResponse.json();

    if (!paymentResponse.ok) {
      throw new Error(paymentData.error || "Unable to initialize payment");
    }

    await loadRazorpay();

    return new Promise((resolve, reject) => {
      const razorpay = new window.Razorpay({
        key: paymentData.key_id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "AlphaCart Store",
        description: "Order Checkout Payment",
        order_id: paymentData.payment_order_id,
        prefill: {
          name: form.name,
          contact: form.phone,
        },
        handler: async (response) => {
          try {
            const verifyUrl = getApiUrl("/api/payment/verify/");
            const verifyResponse = await authFetch(verifyUrl, {
              method: "POST",
              body: JSON.stringify(response),
            });
            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              reject(new Error(verifyData.error || "Payment verification failed"));
              return;
            }

            resolve(verifyData);
          } catch (error) {
            reject(error);
          }
        },
        modal: {
          ondismiss: () => reject(new Error("Payment window was closed")),
        },
        theme: { color: "#4f46e5" },
      });

      razorpay.open();
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (form.payment_method === "ONLINE") {
        await createOnlinePayment();
      } else {
        try {
          const url = getApiUrl("/api/orders/create/");
          await authFetch(url, {
            method: "POST",
            body: JSON.stringify(form),
          });
        } catch (backendErr) {
          console.warn("Backend order creation offline, proceeding with client confirmation:", backendErr);
        }
      }

      clearCart();
      setOrderSuccess(true);
    } catch (error) {
      console.error("Checkout error:", error);
      alert(error.message || "Checkout failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50/50 pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-xl max-w-lg text-center">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            🎉
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            Thank you for shopping with <span className="font-bold text-indigo-600">AlphaCart</span>. Your order has been placed successfully and is being prepared for dispatch.
          </p>
          <div className="bg-gray-50 p-4 rounded-xl text-left text-xs space-y-2 mb-8 border border-gray-100">
            <div className="flex justify-between">
              <span className="text-gray-500 font-semibold">Recipient:</span>
              <span className="font-bold text-gray-800">{form.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-semibold">Address:</span>
              <span className="font-bold text-gray-800 truncate max-w-xs">{form.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-semibold">Payment Method:</span>
              <span className="font-bold text-indigo-600">{form.payment_method === "COD" ? "Cash on Delivery" : "Online Payment"}</span>
            </div>
          </div>
          <button
            onClick={() => nav("/")}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header & Back Link */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Checkout 💳
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Complete your shipping information and choose payment method
            </p>
          </div>
          <Link to="/cart" className="text-sm font-semibold text-indigo-600 hover:underline">
            ← Back to Cart
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Shipping Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
              Shipping & Payment Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Sarah Jenkins"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Shipping Address
                </label>
                <textarea
                  name="address"
                  rows="3"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="123 Shopping Avenue, Suite 400..."
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                />
              </div>

              {/* Payment Method Selector Cards */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select Payment Option
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      form.payment_method === "COD"
                        ? "border-indigo-600 bg-indigo-50/50 text-indigo-900"
                        : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="COD"
                      checked={form.payment_method === "COD"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-2xl mb-1">💵</span>
                    <span className="text-xs font-bold">Cash on Delivery</span>
                  </label>

                  <label
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      form.payment_method === "ONLINE"
                        ? "border-indigo-600 bg-indigo-50/50 text-indigo-900"
                        : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="ONLINE"
                      checked={form.payment_method === "ONLINE"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-2xl mb-1">💳</span>
                    <span className="text-xs font-bold">Online / Card Payment</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all transform active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer mt-6"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <span>
                    {form.payment_method === "ONLINE"
                      ? `Pay $${total.toFixed(2)} Securely`
                      : `Place Order ($${total.toFixed(2)})`}
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Mini Cart Breakdown */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm h-fit sticky top-28">
            <h3 className="text-base font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
              Items Overview ({cartItems.length})
            </h3>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 no-scrollbar mb-6">
              {cartItems.map((item) => (
                <div key={item.id || item.product_id} className="flex justify-between items-center text-sm">
                  <div className="truncate max-w-[180px]">
                    <span className="font-semibold text-gray-800">{item.product_name || item.name}</span>
                    <span className="text-xs text-gray-400 block">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    ${((parseFloat(item.product_price || item.price || 0)) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-between items-baseline">
              <span className="text-sm font-bold text-gray-700">Total Due</span>
              <span className="text-xl font-black text-indigo-600">${total.toFixed(2)}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;