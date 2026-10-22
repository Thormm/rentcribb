import { useState } from "react";
import { FaWhatsapp, FaInstagram, FaTimes } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import logo from "../assets/logo2.png";
import { HiMail } from "react-icons/hi";
import { FiShield } from "react-icons/fi";
import termsText from "../documents/terms.txt?raw";
import privacyText from "../documents/privacy.txt?raw";

function IconBtn({
  children,
  label,
  bgColor = "#CDBCEC",
  href,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  bgColor?: string;
  href?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href ?? "#"}
      onClick={onClick}
      target={href ? "_blank" : undefined}
      rel={href ? "noopener noreferrer" : undefined}
      aria-label={label}
      className="rounded-full text-black p-2"
      style={{ backgroundColor: bgColor }}
    >
      {children}
    </a>
  );
}

interface FooterProps {
  bgColor?: string;
}

const Footer = ({ bgColor = "#000000" }: FooterProps) => {
  const [terms_privacy, setTerms_privacy] = useState(false);
  const [docType, setDocType] = useState<"terms" | "privacy">("terms");

  const docText = docType === "terms" ? termsText : privacyText;

  const openDoc = (type: "terms" | "privacy") => {
    setDocType(type);
    setTerms_privacy(true);
  };

  const whatsappMessage = encodeURIComponent(
    "Hello Cribb Africa, I'd like to know more!"
  );

  return (
    <>
      <footer
        style={{ backgroundColor: bgColor }}
        className="text-white border-t border-white/10"
      >
        <div className="max-w-6xl mx-auto px-6 py-10">
          {/* ===== MAIN GRID ===== */}
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
            {/* Brand */}
            <div className="flex flex-col items-center lg:items-start text-white lg:w-[38%] lg:pr-10">
              <div className="flex flex-col items-center lg:items-start gap-1 w-fit">
                <div className="flex items-center gap-2">
                  <img
                    src={logo}
                    alt="Cribb logo"
                    className="h-7 w-7 object-contain"
                  />
                  <span className="text-2xl lg:text-3xl font-bold text-white leading-none">
                    Cribb.<span className="text-[#C2C8DA]">Africa</span>
                  </span>
                </div>

                <span className="text-[11px] self-end whitespace-nowrap">
                  School Housing :{" "}
                  <span className="text-[#FFA1A1]">Made Soft</span> ✨
                </span>
              </div>

              <p className="text-[11px] mt-2 lg:mt-6 leading-relaxed text-neutral-300 max-w-xs text-center lg:text-left">
                Making it easier, faster, and cheaper for uni-students to rent
                and find a roommate — even from home, before they ever set foot
                on campus.
              </p>
            </div>

            {/* Products + Company — side by side on mobile */}
            <div className="grid grid-cols-2 gap-6 lg:contents">
              {/* Products */}
              <div className="lg:w-[18%]">
                <h3 className="font-semibold text-sm lg:text-base mb-3 text-[#FFA1A1]">
                  Products
                </h3>
                <ul className="space-y-3 text-white text-xs lg:text-sm">
                  <li>
                    <a
                      href="https://www.student.cribb.africa/explore"
                      className="hover:text-[#FFA1A1]"
                    >
                      Find Roommate
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.student.cribb.africa/studentlisting"
                      className="hover:text-[#FFA1A1]"
                    >
                      Rent a Space
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.business.cribb.africa/businessdash"
                      className="hover:text-[#FFA1A1]"
                    >
                      List Your Space
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.business.cribb.africa/businessrequests"
                      className="hover:text-[#FFA1A1]"
                    >
                      Reply Rent Request
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div className="lg:w-[18%]">
                <h3 className="font-semibold text-sm lg:text-base mb-3 text-[#FFA1A1]">
                  Company
                </h3>
                <ul className="space-y-3 text-white text-xs lg:text-sm">
                  <li>
                    <a href="#" className="hover:text-[#FFA1A1]">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-[#FFA1A1]">
                      Careers
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={() => openDoc("privacy")}
                      className="hover:text-[#FFA1A1] text-left"
                    >
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => openDoc("terms")}
                      className="hover:text-[#FFA1A1] text-left"
                    >
                      Terms of Use
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="lg:w-[20%]">
              <h3 className="font-semibold text-sm lg:text-base mb-3 text-[#FFA1A1]">
                Get in Touch
              </h3>

              <span className="flex items-center gap-2 text-xs lg:text-sm">
                <HiMail className="w-4 h-4 lg:w-5 lg:h-5" /> hola@cribb.africa
              </span>

              <div className="flex items-center gap-3 mt-4">
                <IconBtn
                  label="Twitter / X"
                  bgColor="#BCD2EC"
                  href="https://x.com/CribbAfrica"
                >
                  <FaXTwitter className="w-5 h-5" />
                </IconBtn>

                <IconBtn
                  label="Instagram"
                  bgColor="#D7CAEE"
                  href="https://www.instagram.com/cribbafrica"
                >
                  <FaInstagram className="w-5 h-5" />
                </IconBtn>

                <IconBtn
                  label="WhatsApp"
                  bgColor="#DBEDD2"
                  href={`https://wa.me/2349028311876?text=${whatsappMessage}`}
                >
                  <FaWhatsapp className="w-5 h-5" />
                </IconBtn>
              </div>

              <p className="text-xs lg:text-sm mt-4 leading-relaxed">
                11, Oremeji Close, Ibatedo-Ojo, Lagos, Nigeria.
              </p>
            </div>
          </div>

          {/* ===== BOTTOM BAR ===== */}
          <div
            className="mt-8 lg:mt-10 pt-4 w-full border-t-4"
            style={{
              borderStyle: "dashed",
              borderImage:
                "repeating-linear-gradient(to right, #FFFFFF4D 0, #FFFFFF4D 10px, transparent 6px, transparent 24px) 1",
            }}
          />
          <div className="grid grid-cols-2 gap-3 text-[10px] lg:flex lg:flex-row lg:items-center lg:justify-between lg:text-[11px] text-[#FFFFFFB2]">
            <span>© 2026 CribbAfrica. PropTech for Uni-Students.</span>
            <span className="flex items-center lg:justify-end">
              <FiShield className="h-4 w-4 mr-1" />
              CAC Registered | RC9918697
            </span>
          </div>
        </div>
      </footer>

      {/* ===== TERMS / PRIVACY MODAL ===== */}
      {terms_privacy && (
        <div className="fixed inset-0 bg-black/90 z-50 scrollbar-hide overflow-y-scroll no-scrollbar">
          <div className="relative mx-5 md:mx-auto my-10 md:w-2/5 bg-[#F4F6F5] border-3 rounded-4xl border-black p-6">
            <div
              className="absolute -top-3 border-2 border-white -left-3 w-12 h-12 rounded-full bg-black flex items-center justify-center cursor-pointer"
              onClick={() => setTerms_privacy(false)}
            >
              <FaTimes className="text-white text-2xl" />
            </div>

            <h2 className="text-2xl mt-5 font-medium text-center text-black">
              {docType === "terms" ? "Terms of Use" : "Privacy Policy"}
            </h2>

            <div
              className="mt-1 mb-5 md:w-95 border-t-4 mx-auto text-[#0000004D]"
              style={{
                borderStyle: "dashed",
                borderImage:
                  "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
              }}
            />

            <div className="space-y-4 max-h-[60vh] overflow-y-auto text-sm text-black whitespace-pre-wrap">
              {docText}
            </div>

            <div
              className="mt-5 md:w-95 border-t-4 mx-auto text-[#0000004D]"
              style={{
                borderStyle: "dashed",
                borderImage:
                  "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 6px, transparent 24px) 1",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;