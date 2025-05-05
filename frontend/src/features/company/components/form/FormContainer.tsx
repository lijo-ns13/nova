import React from "react";
import { Briefcase } from "lucide-react";

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
    <div className="max-w-3xl mx-auto overflow-hidden transition-all duration-300 bg-white rounded-xl shadow-lg animate-fade-in">
      <div className="relative p-6 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white">
        <div className="absolute right-0 top-0 w-64 h-64 opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="currentColor"
              d="M48.8,-64.1C63.8,-51.6,77.2,-37.9,81.6,-21.7C86,-5.5,81.3,13.1,72.7,28.8C64.1,44.6,51.5,57.4,36.9,63.3C22.3,69.3,5.7,68.3,-12.5,67.7C-30.6,67.1,-50.3,67,-61.7,56.5C-73.1,46,-76.2,25.1,-75.2,5.8C-74.2,-13.5,-69.1,-31.3,-57.8,-43.9C-46.5,-56.5,-29.1,-63.8,-11.7,-67.2C5.6,-70.6,33.8,-76.7,48.8,-64.1Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-white bg-opacity-20 p-2 rounded-lg">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="mt-1 text-blue-100 font-light">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">{children}</div>
    </div>
  );
};

export default FormContainer;
