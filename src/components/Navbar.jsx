import NavLogo from "./NavLogo";
import NavIcons from "./NavIcons";
import { useState, useRef, useEffect } from "react";
import ProductCard from "./ProductCard";
import { useProducts } from "../services/ProductContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const { products } = useProducts();
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      const clickedDesktop = desktopSearchRef.current?.contains(event.target);

      const clickedMobile = mobileSearchRef.current?.contains(event.target);

      if (!clickedDesktop && !clickedMobile) {
        setSearch("");
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredProducts =
    search.trim() === ""
      ? []
      : products.filter((product) =>
          [product.name, product.category, product.tag, product.description]
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase()),
        );

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      {/* Top Row */}
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-6">
        <NavLogo />

        {/* Desktop Search */}
        <div ref={desktopSearchRef} className="hidden md:block flex-1 relative">
          <input
            type="text"
            placeholder="Search sarees, kurtis, lehengas..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowResults(true);
            }}
            className="w-full border border-purple-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {search && showResults && (
            <div
              style={{ overscrollBehavior: "contain" }}
              className="absolute top-12 left-0 right-0 bg-white rounded-2xl shadow-xl border border-purple-100 max-h-96 overflow-y-auto overscroll-contain z-50"
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.slice(0, 8).map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      navigate(`/product/${product.id}`);
                      setSearch("");
                      setShowResults(false);
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-purple-50 cursor-pointer"
                  >
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-purple-600">
                        ₹{product.price}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-400">
                  No products found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Search Row */}
        <div ref={mobileSearchRef} className="md:hidden px-4 pb-0 relative">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowResults(true);
            }}
            className="w-full border border-purple-200 rounded-full px-4 py-3 text-sm"
          />

          {/* Mobile Results */}
          {search && showResults && (
            <div className="absolute  top-14 bg-white rounded-2xl shadow-xl border border-purple-100 max-h-80 overflow-y-auto overscroll-contain z-50">
              {filteredProducts.length > 0 ? (
                filteredProducts.slice(0, 8).map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      navigate(`/product/${product.id}`);
                      setSearch("");
                      setShowResults(false);
                    }}
                    className="flex items-center gap-3 p-3 border-b border-gray-100"
                  >
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />

                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-purple-600">
                        ₹{product.price}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-400">
                  No products found
                </div>
              )}
            </div>
          )}
        </div>

        <NavIcons />
      </div>
    </header>
  );
}
