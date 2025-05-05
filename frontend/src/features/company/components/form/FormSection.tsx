import React from "react";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <div className="group">
      <div className="flex items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <div className="flex-grow ml-4 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
      </div>
      <div className="p-5 rounded-lg border border-gray-100 bg-gray-50 transition-all duration-300 space-y-5 shadow-sm group-hover:shadow group-hover:bg-white">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
