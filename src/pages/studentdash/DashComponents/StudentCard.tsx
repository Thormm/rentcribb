import React from "react";
import { MdWoman2 } from "react-icons/md";
import { FaUtensils, FaFilm, FaBook } from "react-icons/fa";
import { CgCross } from "react-icons/cg";

// ----------------------- Types -----------------------
export interface CardItem {
  id: number | string;
  course: string;
  level: string;
}

// ----------------------- StudentCard Component -----------------------
interface StudentCardProps {
  item: CardItem;
}

const StudentCard: React.FC<StudentCardProps> = ({ item }) => {
  return (
   <div className="relative text-black bg-[#EBD96B] rounded-4xl shadow-md text-center w-35 md:w-45 md:px-3 md:py-5 sm:px-5 sm:py-5">
  {/* Top circle */}
  <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-[#C2C8DA4D] w-24 h-24 sm:w-28 sm:h-28 md:w-30 md:h-30 rounded-full flex items-center justify-center">
    <span className="text-2xl sm:text-3xl md:text-3xl font-semibold">
      {item.id}
    </span>
  </div>

  {/* Body */}
  <div className="mt-16 sm:mt-20">
    <div className="flex items-center justify-between w-full">
      {/* Woman icon */}
      <MdWoman2 className="text-3xl shrink-0" />

      {/* Text */}
      <div className="flex-1 min-w-0 text-center">
        <span className="block truncate text-xs  leading-snug sm:leading-loose">
          {item.course}
        </span>
        <span className="block truncate  text-xs  leading-snug sm:leading-loose">
          {item.level}
        </span>
      </div>

      {/* Cross icon */}
      <CgCross className="text-3xl shrink-0" />
    </div>

    {/* Icons row */}
    <div className="flex justify-center space-x-2 sm:space-x-3 mt-2 mb-5">
      <FaUtensils className="text-2xl sm:text-3xl rounded-full bg-pink-400 p-1" />
      <FaFilm className="text-2xl sm:text-3xl rounded-full bg-pink-400 p-1" />
      <FaBook className="text-2xl sm:text-3xl rounded-full bg-pink-400 p-1" />
    </div>
  </div>
</div>


  );
};

export default StudentCard;
