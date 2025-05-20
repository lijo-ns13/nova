import React, { ReactNode } from "react";

interface DetailCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const DetailCard: React.FC<DetailCardProps> = ({
  title,
  children,
  className = "",
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100">
        {title}
      </h3>
      <div className="mt-2">{children}</div>
    </div>
  );
};

export default DetailCard;
