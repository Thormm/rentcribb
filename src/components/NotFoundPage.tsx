import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo2.png";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">

        {/* Logo + brand */}
        <div className="flex items-center gap-2 mb-8">
          <img
            src={logo}
            alt="Cribb logo"
            className="h-8 w-8 object-contain"
          />
          <span className="text-2xl md:text-3xl font-bold leading-none">
            Cribb.<span className="text-[#C2C8DA]">Africa</span>
          </span>
        </div>

        {/* Big 404 */}
        <h1 className="text-[100px] md:text-[180px] font-extrabold leading-none tracking-tight">
          4<span className="text-[#FFA1A1]">0</span>4
        </h1>

        {/* Tagline styled like your footer */}
        <div className="mt-2 mb-8">
          <span className="text-xs md:text-sm">
            Room Not Found :{" "}
            <span className="text-[#FFA1A1]">Lost in the hallway</span> ✨
          </span>
        </div>

        {/* Message */}
        <p className="max-w-md text-sm md:text-base text-neutral-400 leading-relaxed">
          Looks like this page packed its bags and moved out. The link
          might be broken, or you may have mistyped the address.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-full border border-white/20 bg-transparent text-white text-sm font-medium hover:bg-white/10 transition"
          >
            ← Go Back
          </button>

          <Link
            to="/"
            className="px-6 py-3 rounded-full bg-[#FFA1A1] text-black text-sm font-medium hover:bg-[#ff8a8a] transition"
          >
            Take Me Home
          </Link>
        </div>
      </div>

      {/* ===== FOOTER-ISH STRIP ===== */}
      <div className="border-t border-white/10 px-6 py-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#FFFFFFB2]">
          <span>© 2026 CribbAfrica. PropTech for Uni-Students.</span>
          <span className="flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-[#FFA1A1] mr-2" />
            School Housing : Made Soft ✨
          </span>
        </div>
      </div>
    </div>
  );
}