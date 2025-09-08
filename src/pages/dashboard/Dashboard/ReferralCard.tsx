import React from "react";
import { HiMiniUserGroup } from "react-icons/hi2";
import { BsQrCode } from "react-icons/bs";
import { IoCopyOutline } from "react-icons/io5";

interface ReferralCardProps {
  balance?: number;
  referral?: number;
  total?: number;
  code?: string;
}

const ReferralCard: React.FC<ReferralCardProps> = ({
  balance = 100000,
  referral = 245,
  total = 250000,
  code = "ZARK25",
}) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      alert(`${code} copied to clipboard`);
    } catch {
      alert("Unable to copy");
    }
  };

  return (
    <div className="flex items-center relative text-black w-full">
      {/* Pink card */}
      <div className="bg-[#FFA1A1] pl-6 w-full py-6 rounded-[2rem] shadow-lg z-10">
        <div className="flex justify-start items-center gap-8">
          {/* Left: Balance */}
          <div className="flex items-center text-left">
            <div className="flex items-center text-xl">
              <HiMiniUserGroup className="w-10 h-10 mr-3" />
            </div>
            <div>
              <div className="text-md">Balance</div>
              <div className="text-xl font-semibold">
                {Number(balance).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Right: Referral */}
          <div>
            <div className="text-md">Referral</div>
            <div className="text-xl font-semibold">{referral}</div>
          </div>
        </div>

        <div className="text-sm text-black/50 mt-3">
          Total: {Number(total).toLocaleString()}
        </div>
      </div>

      {/* Copy / QR block */}
      <div className="flex flex-col items-center -ml-3 relative z-20">
        <span className="text-white text-xs font-bold mb-2">COPY</span>

        <button
          type="button"
          onClick={handleCopy}
          className="w-22 h-22 rounded-full bg-[#C2C8DA4D] flex items-center justify-center shadow-lg"
        >
          <BsQrCode className="text-white text-4xl" />
        </button>

        <div className="flex items-center gap-1 text-white text-xs font-semibold mt-2">
          <span>{code}</span> <IoCopyOutline className="text-white text-xl" />
        </div>
      </div>
    </div>
  );
};

export default ReferralCard;
