// ReferralCard.tsx
import React, { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { HiMiniUserGroup } from "react-icons/hi2";
import { BsQrCode } from "react-icons/bs";
import { IoCopyOutline, IoShareSocialSharp } from "react-icons/io5";
import { MdDownload } from "react-icons/md";
import domtoimage from "dom-to-image";

interface ReferralCardProps {
  balance?: number;
  referral?: number;
  total?: number;
  code?: string;
}

const ReferralCard: React.FC<ReferralCardProps> = ({
  balance = 0,
  referral = 0,
  total = 0,
  code = "",
}) => {
  // modal + states
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ref to QR wrapper (white background) for dom-to-image
  const qrWrapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // referral url
  const referralURL = `https://www.cribb.africa/signup?ref=${encodeURIComponent(code || "")}`;

  useEffect(() => {
    if (!showModal) {
      setCopied(false);
      setErrorMsg(null);
    }
  }, [showModal]);

  // copy referral url to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error(err);
      setErrorMsg("Unable to copy link");
    }
  };

  // download QR as PNG
  const handleDownloadImage = async () => {
    if (!qrWrapRef.current) return;
    setDownloading(true);
    setErrorMsg(null);
    try {
      const dataUrl = await domtoimage.toPng(qrWrapRef.current, {
        bgcolor: "#ffffff",
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `cribb-referral-${code || "code"}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to download image");
    } finally {
      setDownloading(false);
    }
  };

  // share image using Web Share API when possible; fallback to opening whatsapp share of URL
  const handleShareImage = async () => {
    if (!qrWrapRef.current) return;
    setSharing(true);
    setErrorMsg(null);

    try {
      const blob = await domtoimage.toBlob(qrWrapRef.current, {
        bgcolor: "#ffffff",
      });

      // If browser supports sharing files
      // @ts-ignore
      if (navigator.share && (navigator as any).canShare?.({ files: [new File([blob], "qrcode.png") ] })) {
        const file = new File([blob], "cribb-referral.png", { type: "image/png" });
        // @ts-ignore
        await navigator.share({
          files: [file],
          title: "Join Cribb",
          text: "Join Cribb using my referral link",
        });
        setShowModal(false);
        setSharing(false);
        return;
      }

      // Fallback: open WhatsApp share with referral URL (image sharing fallback)
      const encoded = encodeURIComponent(referralURL);
      const whatsapp = `https://api.whatsapp.com/send?text=${encoded}`;
      window.open(whatsapp, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error(err);
      setErrorMsg("Sharing not supported");
    } finally {
      setSharing(false);
    }
  };

 

  // close on Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(false);
    };
    if (showModal) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showModal]);

  // open modal handlers (QR button or code text)
  const openModal = () => setShowModal(true);

  return (
    <>
      {/* ====== DESKTOP VIEW (unchanged structure) ====== */}
      <div className="w-full relative">
        <div className="hidden md:flex items-center text-black w-full">
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
                    ₦{Number(balance).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Right: Referral */}
              <div>
                <div className="text-md">Referral</div>
                <div className="text-xl font-semibold">{referral}</div>
              </div>
            </div>

            <div className="text-sm font-bold mt-5">
              Total: ₦{Number(total).toLocaleString()}
            </div>
          </div>

          {/* Copy / QR block (desktop) */}
          <div className="flex flex-col items-center -ml-3 relative z-20">
            <span className="text-white text-xs font-bold mb-2">COPY</span>

            {/* QR button opens modal */}
            <button
              type="button"
              onClick={openModal}
              className="w-22 h-22 rounded-full bg-[#C2C8DA4D] flex items-center justify-center shadow-lg"
              aria-label="Open referral QR"
            >
              <BsQrCode className="text-white text-4xl" />
            </button>

            {/* code text clickable opens modal too */}
            <div
              onClick={openModal}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === "Enter" && openModal()}
              className="flex items-center gap-1 text-white text-xs font-semibold mt-2 cursor-pointer select-none"
              aria-label="Open referral link modal"
            >
              <span>{code}</span>
              <IoCopyOutline className="text-white text-xl" />
            </div>
          </div>
        </div>

        {/* ====== MOBILE VIEW (keeps original layout but smaller text) ====== */}
        <div className="md:hidden flex justify-between items-center bg-[#FFA1A1] p-3 rounded-2xl shadow-lg text-black">
          {/* Left Section (mobile smaller) */}
          <div className="flex flex-col items-start justify-center text-left">
            <HiMiniUserGroup className="w-8 h-8 mb-1 text-black" />

            <div className="font-normal text-[10px]">Referral Balance</div>
            <div className="text-[11px] font-bold mb-2">
              ₦{Number(balance).toLocaleString()}
            </div>

            <div className="font-normal text-[10px]">Referrals</div>
            <div className="text-[11px] font-bold">{referral}</div>

            <div className="font-bold mt-3 text-[12px]">
              Total: ₦{Number(total).toLocaleString()}
            </div>
          </div>

          {/* Right Section mobile */}
          <div className="flex flex-col items-center justify-right">
            <button
              onClick={openModal}
              className="bg-[#C2C8DA4D] p-4 rounded-full shadow-lg flex items-center justify-center"
              aria-label="Open referral QR"
            >
              <BsQrCode className="text-white text-5xl" />
            </button>

            <div
              onClick={openModal}
              role="button"
              tabIndex={0}
              className="flex items-center gap-1 mt-2 text-white text-[11px] font-semibold cursor-pointer"
            >
              <span className="truncate max-w-[90px]">{code}</span>
              <IoCopyOutline className="text-white text-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* ====== MODAL (keeps a subtle design, overlay dark bg) ====== */}
    {showModal && (
  <div
    className="fixed inset-0 w-screen h-screen z-50 flex items-center justify-center bg-black/90 p-4"
    role="dialog"
    aria-modal="true"
    onClick={() => setShowModal(false)}
  >
    <div
      className="relative bg-black text-white rounded-2xl p-5 w-full max-w-[360px] md:max-w-[440px]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Icon */}
      <button
        className="absolute top-3 right-4 text-[red] hover:text-white text-2xl"
        onClick={() => setShowModal(false)}
      >
        ✕
      </button>

      {/* QR Wrapper */}
      <div className="flex justify-center my-7">
        <div
          ref={qrWrapRef}
          className="bg-white p-4 rounded-xl flex items-center justify-center"
          style={{
            width: window.innerWidth < 480 ? 200 : 260,
            height: window.innerWidth < 480 ? 200 : 260,
          }}
        >
          <QRCode value={referralURL} size={window.innerWidth < 480 ? 170 : 230} />
        </div>
      </div>

      {/* Share & Download Icons */}
      <div className="flex items-center justify-center gap-8 mb-5">
        <button
          onClick={handleShareImage}
          className="flex flex-col items-center justify-center text-center"
          disabled={sharing}
        >
          <IoShareSocialSharp className="text-3xl md:text-4xl" />
          <span className="text-[11px] font-medium mt-[6px]">
            {sharing ? "Sharing..." : "Share Image"}
          </span>
        </button>

        <button
          onClick={handleDownloadImage}
          className="flex flex-col items-center justify-center text-center"
          disabled={downloading}
        >
          {/* ✅ Replaced icon */}
          <MdDownload className="text-3xl md:text-4xl" />
          <span className="text-[11px] font-medium mt-[6px]">
            {downloading ? "Downloading..." : "Download Image"}
          </span>
        </button>
      </div>

      {/* Copy link */}
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          className="flex-1 bg-white text-black rounded-lg px-3 py-2 text-xs md:text-sm"
          readOnly
          value={referralURL}
          onFocus={(e) => e.currentTarget.select()}
        />

        <button
          onClick={handleCopyLink}
          className="bg-[#FFA1A1] text-black px-3 py-2 rounded-lg text-[11px] md:text-sm font-semibold"
        >
          {copied ? "Copied!" : <IoCopyOutline className="text-lg" />}
        </button>
      </div>

      {errorMsg && (
        <p className="text-red-400 text-xs mt-2 text-center">{errorMsg}</p>
      )}
    </div>
  </div>
)}


    </>
  );
};

export default ReferralCard;
