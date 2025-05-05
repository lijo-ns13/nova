import React, { useState, useRef } from "react";
import { X, PlusCircle } from "lucide-react";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  error?: boolean;
}

const TagsInput: React.FC<TagsInputProps> = ({
  value,
  onChange,
  placeholder = "Type and press Enter to add",
  error = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter key
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
    // Comma key
    else if (e.key === ",") {
      e.preventDefault();
      addTag();
    }
    // Backspace when input is empty
    else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      const newTags = [...value];
      newTags.pop();
      onChange(newTags);
    }
  };

  const addTag = () => {
    if (!inputValue.trim()) return;

    // Normalize the tag (trim whitespace, capitalize first letter)
    const normalizedTag =
      inputValue.trim().charAt(0).toUpperCase() + inputValue.trim().slice(1);

    // Check if tag already exists (case insensitive)
    if (!value.some((t) => t.toLowerCase() === normalizedTag.toLowerCase())) {
      onChange([...value, normalizedTag]);
    }

    setInputValue("");
    inputRef.current?.focus();
  };

  const removeTag = (index: number) => {
    const newTags = [...value];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  const containerClasses = `
    flex flex-wrap gap-2 p-2 border rounded-lg focus-within:ring-2 focus-within:ring-opacity-50 transition-all duration-200
    ${
      error
        ? "border-red-300 focus-within:ring-red-200 focus-within:border-red-500"
        : "border-gray-300 focus-within:ring-blue-200 focus-within:border-blue-500"
    }
    ${isFocused ? "shadow-sm" : ""}
  `;

  return (
    <div className="relative">
      <div
        className={containerClasses}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag, index) => (
          <div
            key={index}
            className="flex items-center gap-1 bg-green-50 text-green-800 px-2 py-1 rounded-md text-sm border border-green-100 animate-scaleIn"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="p-0.5 rounded-full hover:bg-green-100 text-green-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        <div className="flex-1 min-w-[180px] flex items-center gap-1">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 min-w-[100px] outline-none text-gray-700 bg-transparent placeholder:text-gray-400 py-1"
            placeholder={value.length === 0 ? placeholder : "Add more..."}
          />

          {inputValue && (
            <button
              type="button"
              onClick={addTag}
              className="text-green-500 hover:text-green-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagsInput;
