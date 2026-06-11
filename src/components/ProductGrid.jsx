import { useState } from "react";
import ProductCard from "./ProductCard";
import { useProducts } from "../services/ProductContext";

export default function ProductGrid() {
  const { products } = useProducts();

  const categories = [
    "All",
    "Western Dress",
    "Gown",
    "Kurti",
    "Lehenga",
    "Salwar",
    "Saree",
    "Botua",
    "Other",
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <section className="max-w-6xl mx-auto px-3 sm:px-6 py-16">
      <h2 className="text-3xl font-bold text-purple-800 mb-8 text-center">
        Our Collection
      </h2>

      {/* Mobile */}
      <div className="md:hidden mb-6 px-2">
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="
        w-full
        appearance-none
        bg-white/90
        backdrop-blur-md
        border border-purple-200
        rounded-2xl
        px-5
        py-3
        text-purple-800
        font-medium
        shadow-lg
        focus:outline-none
        focus:ring-2
        focus:ring-purple-500
        focus:border-purple-500
      "
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Custom Arrow */}
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full border transition ${
              selectedCategory === category
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-purple-100"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Category Filter */}
      {/* <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full border transition ${
              selectedCategory === category
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-purple-100"
            }`}
          >
            {category}
          </button>
        ))}
      </div> */}

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            image={product.images?.[0]}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No products found in this category.
        </p>
      )}
    </section>
  );
}
