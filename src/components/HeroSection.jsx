import { useState, useEffect } from "react";

const slides = [
  {
    image:
      "https://scontent.fblr5-1.fna.fbcdn.net/v/t39.30808-6/649507348_122104123701261556_3799838954082532094_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=f9ID7gC_bSQQ7kNvwGO9gnS&_nc_oc=Adq9SKiNHFOiaYAdjfjmFEgyQK_HjTlChQmFL6UVN2LwP51jdY-NUlhaStd3s0Y0cSQ&_nc_zt=23&_nc_ht=scontent.fblr5-1.fna&_nc_gid=UkuNNzxFQZpH-bYqpv_xTw&_nc_ss=7b2a8&oh=00_Af-oDjaXxWFdJ_S9sw632c3rhObxa_kjEIv5w-lSdMliug&oe=6A2340D3",
    title: "Saree Collection",
    subtitle: "Bloom in every step",
  },
  {
    image:
      "https://scontent.fblr5-1.fna.fbcdn.net/v/t39.30808-6/656646812_122105586717261556_2767283071988817549_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_ohc=q2D8nZ1AM2UQ7kNvwFcxeNx&_nc_oc=AdrDAw8X4BeI74Pb5fiBm4_4I7EZQQDnBu1J9B_OR5McS1VHeKWuPriTElLwxAjVt6I&_nc_zt=23&_nc_ht=scontent.fblr5-1.fna&_nc_gid=WgnA7FfBly88d4IQEuEU4w&_nc_ss=7b2a8&oh=00_Af-L6t9HLZhiLyG_l0ZPlkFP8hoJOnbEA6g3wE0qaKIg-g&oe=6A235317",
    title: "Botua Collection",
    subtitle: "Grace redefined",
  },
  {
    image:
      "https://scontent.fblr5-1.fna.fbcdn.net/v/t39.30808-6/660308507_122107723677261556_4090408289323520290_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_ohc=p8v4iKbKAyEQ7kNvwGvA7Y1&_nc_oc=AdoyYnbycoZDEeJRskPuaMAfdINrt0yJUZKrn6Sh9PTBSE0q3c0oFPCeY4UWASRnMRE&_nc_zt=23&_nc_ht=scontent.fblr5-1.fna&_nc_gid=jg06V-cbnty04XHQOTkH8A&_nc_ss=7b2a8&oh=00_Af_9OLrwz4k6O8peWgungNexbr38lfFD1pSQPtnevOwvzA&oe=6A2374E4",
    title: "Colourful Saree Collection",
    subtitle: "Celebrate in style",
  },
  {
    image:
      "https://scontent.fblr5-1.fna.fbcdn.net/v/t39.30808-6/668645073_122108046525261556_6805708440946466663_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=ruIEeRxWZMkQ7kNvwEzgfCI&_nc_oc=AdoJdr6d9K97JJqpm8rkN8bKyMYiLetWs2RPGTJ9DU_s7TVlma2kXif5AvJtV7NvcZs&_nc_zt=23&_nc_ht=scontent.fblr5-1.fna&_nc_gid=lKEx4uFfkzbmieiZoY4JaA&_nc_ss=7b2a8&oh=00_Af-c9k0h1MrClJOuSs0Vc3RZiTUApniRIpdCnB0r9oVHhA&oe=6A23657D",
    title: "Party Wear Gowns",
    subtitle: "Be the showstopper",
  },
  {
    image:
      "https://scontent.fblr5-1.fna.fbcdn.net/v/t39.30808-6/669016003_122108246373261556_7520004304061607993_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_ohc=yOsAA_lLN10Q7kNvwH5ev70&_nc_oc=Adq4Tn9iQmBYKinPIAg7Hy40SJESLb7-0CSxYUPhaJWEr2vHXy_TcdiRJ9iZp741Xrk&_nc_zt=23&_nc_ht=scontent.fblr5-1.fna&_nc_gid=QfV_ugS6Rl2ECSDq3Qw1hA&_nc_ss=7b2a8&oh=00_Af8yj6wSouvFaI989S_lUVVlL2sBahMFopKefyxbuuznwA&oe=6A234FA6",
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
