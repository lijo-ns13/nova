import React from "react";

interface FormContainerProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-blue-100">{subtitle}</p>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

export default FormContainer;
