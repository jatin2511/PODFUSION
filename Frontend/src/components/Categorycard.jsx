import React from 'react';

export const Categorycard = ({ element }) => {
  return (
    <div
      className={`w-[150px] h-[150px] sm:w-[250px] rounded-lg p-[10px] sm:p-[14px] transition-all duration-400 ease-in-out transform hover:-translate-y-2 hover:shadow-md hover:brightness-125 my-2 px-3 `}
      style={{ backgroundColor: element.color }}>
      <div className="text-[#F2F3F4] text-lg font-semibold sm:text-2xl">
        {element.name}
      </div>
      <div className="flex justify-end items-end w-full h-full">
        <img
          src={element.img}
          alt="podcast-image"
          className="h-[90px] w-[80px] object-cover"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 66%, 0 98%)',
            transform: 'rotate(20deg)'
          }}
        />
      </div>
    </div>
  );
};
export default Categorycard;