import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-purple-950 text-white mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-10 flex-wrap justify-center">
          {/* About */}
          <div className="md:col-span-1 space-y-4 text-center">
            <h3 className="text-xl font-bold mb-4">About Rituparna</h3>

            <p className="text-purple-100 leading-relaxed text-sm">
              From a passion for timeless fashion to creating elegant ethnic
              collections, Nir Boutique brings together tradition and modern
              style. Founded by Rituparna, our mission is to help every woman
              feel confident, graceful, and beautiful through thoughtfully
              curated designs.
            </p>
          </div>

          {/* Collections */}
          <div className="md:col-span-1 space-y-4 text-center">
            <h3 className="text-xl font-bold mb-4">Collections by Ritu</h3>

            <ul className="space-y-2 text-purple-100 text-sm">
              <li>Designer Saree</li>
              <li>Casual Wear</li>
              <li>Party Wear</li>
              <li>Plus Size Collection</li>
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-1 space-y-4 text-center">
            <h3 className="text-xl font-bold mb-4">Support</h3>

            <ul className="space-y-2 text-purple-100 text-sm">
              <li>
                <a href="/support" className="hover:text-white transition">
                  Help & Support
                </a>
              </li>

              <li>
                <a href="/terms" className="hover:text-white transition">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-purple-800 mt-10 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Social Icons */}
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61587846703133"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-purple-700 transition"
              >
                <FaFacebookF />
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/917001688122?text=Hello%20Nir%20Boutique,%20I%20would%20like%20to%20know%20more%20about%20your%20collections."
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-600 transition"
              >
                <FaWhatsapp />
              </a>

              <a
                href="https://www.instagram.com/YOUR_PAGE"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-600 transition"
              >
                <FaInstagram />
              </a>
            </div>

            {/* Copyright */}
            <p className="text-sm text-purple-200">
              © 2026, Nir Boutique. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
