import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { getApiUrl, getImageUrl, MOCK_PRODUCTS } from "../utils/api";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedToast, setAddedToast] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    let isMounted = true;
    const url = getApiUrl(`/api/products/${id}/`);

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        return response.json();
      })
      .then((data) => {
        if (isMounted) {
          setProduct(data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.warn("API error, searching mock data:", error);
        if (isMounted) {
          const found = MOCK_PRODUCTS.find((p) => p.id === parseInt(id, 10));
          setProduct(found || MOCK_PRODUCTS[0]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product.id, product);
    }
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-gray-500">Loading product details...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center max-w-md">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-6 text-sm">The product you are looking for does not exist or has been removed.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            ← Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(product.image);

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="text-xl">✅</span>
          <div>
            <p className="text-sm font-bold">Added to Cart!</p>
            <p className="text-xs text-gray-300">{product.name} ({quantity} item{quantity > 1 ? 's' : ''})</p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumbs / Back button */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Products</span>
          </Link>
        </div>

        {/* Product Details Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-10">
            
            {/* Product Image */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-50 aspect-square flex items-center justify-center border border-gray-100">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80";
                }}
              />
              {product.category && (
                <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-gray-800 rounded-full shadow-xs">
                  {product.category}
                </span>
              )}
            </div>

            {/* Product Information */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-md">
                    In Stock
                  </span>
                  {product.rating && (
                    <div className="flex items-center gap-1 text-amber-400 text-sm font-bold ml-2">
                      ★ <span>{product.rating}</span>
                      <span className="text-gray-400 font-normal text-xs">({product.reviewsCount || 42} reviews)</span>
                    </div>
                  )}
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                  {product.name}
                </h1>

                <div className="text-3xl font-black text-gray-900 mb-6">
                  ${parseFloat(product.price).toFixed(2)}
                </div>

                <p className="text-gray-600 text-base leading-relaxed mb-8">
                  {product.description ||
                    "Designed with premium craftsmanship, this item offers exceptional functionality, high durability, and top-tier aesthetic appeal."}
                </p>

                {/* Quantity Selector */}
                <div className="mb-8">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-200 transition-colors font-bold text-base"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 font-bold text-gray-900 text-sm">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-200 transition-colors font-bold text-base"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all transform active:scale-98 cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>Add to Cart</span>
                  </button>

                  <Link
                    to="/cart"
                    className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-all"
                  >
                    <span>View Cart</span>
                  </Link>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                <div className="p-2">
                  <div className="text-indigo-600 font-bold text-lg mb-0.5">🚚</div>
                  <div className="text-xs font-semibold text-gray-700">Free Express Shipping</div>
                </div>
                <div className="p-2">
                  <div className="text-indigo-600 font-bold text-lg mb-0.5">🛡️</div>
                  <div className="text-xs font-semibold text-gray-700">2-Year Warranty</div>
                </div>
                <div className="p-2">
                  <div className="text-indigo-600 font-bold text-lg mb-0.5">🔄</div>
                  <div className="text-xs font-semibold text-gray-700">30-Day Return</div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductDetails;