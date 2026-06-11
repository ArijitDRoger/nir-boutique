import { useNavigate } from "react-router-dom";

export default function NavLogo() {
  const navigate = useNavigate();
  return (
    <div
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => navigate("/")}
    >
      {/* <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center">
        <span className="text-white text-sm font-bold">NB</span>
      </div> */}
      <div className="w-15 h-15 rounded-full overflow-hidden border-2 border-white  shadow-lg">
        <img
          src="/nir_logo.jpg"
          alt="Nir Boutique Logo"
          className="w-full h-full object-cover"
        />
      </div>
      <span className="hidden md:block text-purple-700 font-extrabold text-xl tracking-widest">
        নীড় BOUTIQUE
      </span>
    </div>
  );
}
