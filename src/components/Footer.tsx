import {
  FaWhatsapp,
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
} from "react-icons/fa";

function IconBtn({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href="#"
      aria-label={label}
      className="rounded-xl bg-[#CDBCEC] text-black p-3 "
    >
      {children}
    </a>
  );
}

const Footer = () => {
  return (
    <div>{/* ===== FOOTER ===== */}
      <footer className="bg-black text-white border-t border-white/10">
        <div className="max-w-6xl mx-auto py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="text-4xl font-extrabold">Cribb.Africa</div>
            <p className="mt-2 text-md text-white/70">School Life: Made Soft</p>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-md  mb-3">Legal</h3>
            <ul className="space-y-2 text-white/80">
              <li>
                <a href="#" className="hover:text-white text-md ">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white text-md ">
                  Terms &amp; conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-3 text-md " >Company</h3>
            <ul className="space-y-2 text-white/80">
              <li>
                <a href="#" className="hover:text-white text-md ">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white text-md ">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact / Socials */}
          <div>
            <h3 className="font-semibold mb-3 text-md ">Contact us</h3>
            <div className="flex items-center gap-3">
              {/* Rounded square “icon” buttons (swap inner spans with your SVGs later) */}
              <IconBtn label="WhatsApp">
                <FaWhatsapp className="w-6 w-6"/>
              </IconBtn>
              <IconBtn label="Instagram">
                <FaInstagram className="w-6 h-6"/>
              </IconBtn>
              <IconBtn label="Twitter / X">
                <FaTwitter className="w-6 w-6"/>
              </IconBtn>
              <IconBtn label="Facebook">
                <FaFacebook className="w-6 w-6"/>
              </IconBtn>
              <IconBtn label="LinkedIn">
                <FaLinkedin className="w-6 w-6"/>
              </IconBtn>
            </div>
          </div>
        </div>
      </footer></div>
  )
}

export default Footer