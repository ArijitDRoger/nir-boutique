import { useState, useEffect } from "react";

const slides = [
  {
    image: "/hero/img3.jpg",
    title: "Saree Collection",
    subtitle: "Bloom in every step",
  },
  {
    image: "/hero/img2.jpg",
    title: "Botua Collection",
    subtitle: "Grace redefined",
  },
  {
    image: "/hero/img1.jpg",
    title: "Colourful Saree Collection",
    subtitle: "Celebrate in style",
  },
  {
    image: "/hero/img5.jpg",
    title: "Party Wear Gowns",
    subtitle: "Be the showstopper",
  },
  {
    image: "/hero/img4.jpg",
    title: "Attractive Saree Collection",
    subtitle: "Elegance in every thread",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  function prev() {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }

  function next() {
    setCurrent((prev) => (prev + 1) % slides.length);
  }

  return (
    <section className="relative h-[40vh] md:h-screen overflow-hidden mt-16">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            {/* Logo image */}
            <div className="w-24 h-24 md:w-60 md:h-60 rounded-full overflow-hidden border-2 border-white mb-3 md:mb-5 shadow-lg">
              <img
                src="/nir_logo.jpg"
                alt="Nir Boutique Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl md:text-6xl font-extrabold text-white tracking-widest drop-shadow-lg">
              নীড় BOUTIQUE
            </h1>
            <p className="text-white/80 text-sm md:text-lg mt-1 md:mt-2 mb-2 md:mb-4">
              {slide.subtitle}
            </p>
            <span className="bg-purple-600/80 backdrop-blur-sm text-white px-5 py-1.5 rounded-full text-sm font-medium">
              {slide.title}
            </span>
          </div>
        </div>
      ))}

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white text-2xl flex items-center justify-center hover:bg-white/40 transition-colors z-10"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white text-2xl flex items-center justify-center hover:bg-white/40 transition-colors z-10"
      >
        ›
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-white" : "w-2 bg-white/50"}`}
          />
        ))}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 right-8 animate-bounce text-white/60 text-sm z-10">
        ↓ Explore
      </div>
    </section>
  );
}
