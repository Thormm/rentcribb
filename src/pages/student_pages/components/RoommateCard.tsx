import React from "react";
import clsx from "clsx";
import {
  MdOutlineMan4,
  MdOutlineWoman2,
  MdOutlineChat,
  MdPeople,
} from "react-icons/md";
import { CgCross } from "react-icons/cg";
import {
  FaMosque,
  FaBook,
  FaUtensils,
  FaFilm,
  FaMusic,
  FaGamepad,
  FaFutbol,
  FaMoon,
  FaCat,
  FaDog,
} from "react-icons/fa";

// ---------- Types ----------
export interface Roommate {
  id: number;
  user: string;
  gender: "male" | "female";
  religion: "christian" | "muslim" | "none";
  level: string;
  faculty: string;
  move_in_date: string;
  duration: string;
  type: string;
  price: string;
  features: string[];
  pet: string; // "Cat_Dog", "Cat", "Dog", "None"
  school: string;
  created_at: string;
  value?: string; // optional – can be a percentage like "50%" or any string (e.g., "You")
}

// ---------- Utilities ----------
const truncateText = (text: string, maxLength: number = 10) => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
};

// Get numeric price from range string and format with commas
const getNumericPrice = (priceRange: string): string => {
  if (!priceRange || priceRange.trim() === "" || priceRange === "₦0") return "";
  
  const parts = priceRange.split(" - ");
  const firstPrice = parts[0] || priceRange;
  
  // Extract the numeric value from the price string (remove ₦ and commas)
  const numericValue = firstPrice.replace(/[₦,]/g, '').trim();
  
  // Check if it's a valid number
  if (numericValue === "" || isNaN(parseInt(numericValue, 10))) return "";
  
  // Parse as number and format with commas
  const num = parseInt(numericValue, 10);
  if (num === 0) return ""; // Don't show zero
  
  // Format with commas and add ₦ sign
  return `₦${num.toLocaleString()}`;
};

// Map duration to short label
const getDurationShort = (duration: string): string => {
  if (!duration) return "";
  const map: Record<string, string> = {
    "Per Year": "year",
    "Per Session": "session",
    "Per 9months": "9 months",
    "Per 6months": "6 months",
    "Per 3months": "3 months",
    "Per Semester": "semester",
    "Per month": "1 month",
  };
  return map[duration] || duration;
};

// ---------- Feature color mapping (HEX codes) ----------
const featureColors: Record<string, string> = {
  Games: "#3B82F6", // blue
  Food: "#22C55E", // green
  Exercise: "#EAB308", // yellow
  Reading: "#A855F7", // purple
  Hangout: "#EC4899", // pink
  Sleep: "#6366F1", // indigo
  Movies: "#EF4444", // red
  Chat: "#14B8A6", // teal
  Music: "#F97316", // orange
};

// ---------- Feature icon mapping ----------
const featureIcons: Record<string, React.ReactNode> = {
  Games: <FaGamepad />,
  Food: <FaUtensils />,
  Exercise: <FaFutbol />,
  Reading: <FaBook />,
  Hangout: <MdPeople />,
  Sleep: <FaMoon />,
  Movies: <FaFilm />,
  Chat: <MdOutlineChat />,
  Music: <FaMusic />,
};

// ---------- Pet Icon with red stroke ----------
const PetIcon = ({
  liked,
  children,
}: {
  liked: boolean;
  children: React.ReactNode;
}) => (
  <div className="relative w-6 h-6 flex items-center justify-center">
    <span className="text-xl">{children}</span>
    {!liked && (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[120%] h-[2px] bg-red-500 transform rotate-45 origin-center"></div>
      </div>
    )}
  </div>
);

// ---------- Helper icons ----------
const GenderIcon = ({ gender }: { gender: string }) =>
  gender === "male" ? (
    <MdOutlineMan4 className="text-3xl mt-2" />
  ) : (
    <MdOutlineWoman2 className="text-3xl mt-2" />
  );

const ReligionIcon = ({ religion }: { religion: string }) =>
  religion === "christian" ? (
    <CgCross className="text-4xl mt-2" />
  ) : religion === "muslim" ? (
    <FaMosque className="text-2xl mt-2" />
  ) : null;

// ---------- Pet logic ----------
const likesCat = (pet: string) => pet === "Cat_Dog" || pet === "Cat";
const likesDog = (pet: string) => pet === "Cat_Dog" || pet === "Dog";

// ---------- Main Card Component ----------
interface RoommateCardProps {
  card: Roommate;
  className?: string;
  bgColor?: string; // optional card background color (hex or Tailwind class)
  avatarBgColor?: string; // optional avatar circle background (default semi-transparent)
}

export const RoommateCard: React.FC<RoommateCardProps> = ({
  card,
  className,
  bgColor = "#F4F6F5",
  avatarBgColor = "#C2C8DA4D",
}) => {
  const priceDisplay = getNumericPrice(card.price);
  const durationShort = getDurationShort(card.duration);
  const hasDuration = card.duration && card.duration !== "";
  const avatarText = card.value || "You";

  return (
    <div
      className={clsx(
        "relative text-black rounded-4xl mt-10 py-6 shadow-md text-center",
        className,
      )}
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="absolute -top-9 left-1/2 transform -translate-x-1/2 w-30 h-30 rounded-full flex items-center justify-center"
        style={{ backgroundColor: avatarBgColor }}
      >
        <span className="text-3xl font-semibold">{avatarText}</span>
      </div>

      <div className="mt-20 justify-center">
        {/* PET ROW – cat above gender, dog above religion */}

        <div className="flex justify-center gap-2 items-center mx-5">
          <div className="w-10 flex justify-center">
            <PetIcon liked={likesCat(card.pet)}>
              <FaCat className="text-black" />
            </PetIcon>
          </div>
          <div className="flex-1"></div>
          <div className="w-10 flex justify-center">
            <PetIcon liked={likesDog(card.pet)}>
              <FaDog className="text-black" />
            </PetIcon>
          </div>
        </div>

        {/* GENDER + DEPT/LEVEL + RELIGION */}
        <div className="flex justify-center gap-2">
          <div className="w-10 flex justify-center">
            <GenderIcon gender={card.gender} />
          </div>
          <div className="flex-1 text-center">
            <p className="text-sm leading-loose">
              {truncateText(card.faculty, 8)} <br /> {card.level}
            </p>
          </div>
          <div className="w-10 flex justify-center">
            <ReligionIcon religion={card.religion} />
          </div>
        </div>

        {/* FEATURES (3 icons) with HEX colors */}
        <div className="flex justify-center space-x-3 mt-2 mb-5">
          {card.features.slice(0, 3).map((feat, idx) => (
            <span
              key={idx}
              className="text-2xl rounded-full p-2 text-black"
              style={{ backgroundColor: featureColors[feat] || "#EC4899" }}
            >
              {featureIcons[feat] || feat}
            </span>
          ))}
        </div>

        {/* PRICE + DURATION */}
        {priceDisplay && (
          <div className="flex justify-center items-center gap-1 mt-1 text-sm">
            <span className="text-[#0556F8]">{priceDisplay}</span>
            {hasDuration && (
              <span className="text-[#0556F8]"> / {durationShort}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoommateCard;