import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/api";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const imageUrl = getImageUrl(product.image);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, product);
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="block relative aspect-4/3 overflow-hidden bg-gray-50">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80";
          }}
        />
        {product.category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-gray-800 rounded-full shadow-xs">
            {product.category}
          </span>
        )}
      </Link>

      {/* Details */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            {product.rating ? (
              <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                ★ <span>{product.rating}</span>
                {product.reviewsCount && (
                  <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
                )}
              </div>
            ) : (
              <span className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">In Stock</span>
            )}
          </div>

          <Link to={`/product/${product.id}`}>
            <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1">
              {product.name}
            </h3>
          </Link>
          
          <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
            {product.description || "High quality product built for premium durability and performance."}
          </p>
        </div>

        {/* Footer Price & Add Button */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
          <div>
            <span className="text-xs text-gray-400 block font-medium">Price</span>
            <span className="text-lg font-black text-gray-900">
              ${parseFloat(product.price).toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-2xs active:scale-95 cursor-pointer"
            title="Add to Cart"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
            </svg>
            <span>Add</span>
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProductCard;