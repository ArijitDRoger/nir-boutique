export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 z-[9999]">
      {/* Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      {/* Brand text */}
      <h1 className="mt-6 text-xl font-bold text-purple-700 tracking-wide">
        Nir Boutique
      </h1>

      <p className="text-sm text-gray-500 mt-2 animate-pulse">
        Loading your experience...
      </p>
    </div>
  );
}
