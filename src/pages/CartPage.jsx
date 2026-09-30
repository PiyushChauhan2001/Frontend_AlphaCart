import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/api";

function CartPage() {
  const { cartItems, total, removeFromCart, updateQuantity, clearCart } = useCart();

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Shopping Cart 🛒
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} selected
            </p>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center max-w-lg mx-auto my-8">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
              🛍️
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto">
              Looks like you haven't added any items to your shopping cart yet.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all transform active:scale-95"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          /* Cart Grid: Items + Order Summary */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const itemPrice = parseFloat(item.product_price || item.price || 0);
                const itemImage = getImageUrl(item.product_image || item.image);

                return (
                  <div
                    key={item.id || item.product_id}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-2xs hover:shadow-xs transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Product info & image */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-20 h-20 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                        <img
                          src={itemImage}
                          alt={item.product_name || item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80";
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900 leading-snug">
                          {item.product_name || item.name || "Product Item"}
                        </h3>
                        <p className="text-sm font-semibold text-gray-500 mt-1">
                          ${itemPrice.toFixed(2)} each
                        </p>
                      </div>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      
                      {/* Quantity control */}
                      <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 font-bold transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3 py-1.5 font-bold text-gray-900 text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <span className="text-base font-black text-gray-900 block">
                          ${(itemPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Order Summary */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col justify-between h-fit sticky top-28">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Estimated Shipping</span>
                    <span className="font-semibold text-emerald-600 uppercase text-xs">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax Estimate</span>
                    <span className="font-semibold text-gray-900">$0.00</span>
                  </div>
                </div>

                <div className="my-6 border-t border-gray-100 pt-4 flex justify-between items-baseline">
                  <span className="text-base font-extrabold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-indigo-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all transform active:scale-98 text-center"
              >
                <span>Proceed to Checkout</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default CartPage;