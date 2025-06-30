import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import userAxios from "../../../../utils/userAxios";

interface SkillsInputProps {
  value: string[];
  onChange: (skills: string[]) => void;
  error?: boolean;
}

const SkillsInput: React.FC<SkillsInputProps> = ({
  value,
  onChange,
  error = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Mock API call for skills suggestions
  const fetchSkillSuggestions = async (query: string) => {
    if (!query || query.length < 1) {
      return [];
    }
    const response = await userAxios.get(
      `${import.meta.env.VITE_API_BASE_URL}/skill/search?q=${query}`,
      { withCredentials: true }
    );
    console.log("response", response);

    const skills: string[] = response.data;
    const lowerQuery = query.toLowerCase();
    return skills
      .filter((skill) => skill.toLowerCase().includes(lowerQuery))
      .slice(0, 5);
  };

  useEffect(() => {
    const getSkillSuggestions = async () => {
      if (inputValue.length > 0) {
        const skillsData = await fetchSkillSuggestions(inputValue);
        console.log("sklldta", skillsData);
        setSuggestions(skillsData);
        setShowSuggestions(skillsData.length > 0);
        setActiveSuggestion(0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    getSkillSuggestions();
  }, [inputValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter key
    if (e.key === "Enter") {
      e.preventDefault();

      if (showSuggestions && suggestions.length > 0) {
        addSkill(suggestions[activeSuggestion]);
      } else if (inputValue.trim()) {
        addSkill(inputValue.trim());
      }
    }
    // Comma key
    else if (e.key === ",") {
      e.preventDefault();
      if (inputValue.trim()) {
        addSkill(inputValue.trim());
      }
    }
    // Arrow down
    else if (e.key === "ArrowDown") {
      if (suggestions.length > 0) {
        setActiveSuggestion((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      }
    }
    // Arrow up
    else if (e.key === "ArrowUp") {
      if (suggestions.length > 0) {
        setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : 0));
      }
    }
    // Escape key
    else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
    // Backspace when input is empty
    else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      const newSkills = [...value];
      newSkills.pop();
      onChange(newSkills);
    }
  };

  const addSkill = (skill: string) => {
    if (!skill) return;

    // Normalize the skill (trim whitespace, capitalize first letter)
    const normalizedSkill =
      skill.trim().charAt(0).toUpperCase() + skill.trim().slice(1);

    // Check if skill already exists (case insensitive)
    if (!value.some((s) => s.toLowerCase() === normalizedSkill.toLowerCase())) {
      onChange([...value, normalizedSkill]);
    }

    setInputValue("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeSkill = (index: number) => {
    const newSkills = [...value];
    newSkills.splice(index, 1);
    onChange(newSkills);
  };

  const handleSuggestionClick = (suggestion: string) => {
    addSkill(suggestion);
  };

  const inputClasses = `flex-1 min-w-[100px] outline-none text-gray-700 bg-transparent ${
    error ? "placeholder:text-red-400" : "placeholder:text-gray-400"
  }`;

  const containerClasses = `flex flex-wrap gap-2 p-2 border rounded-md focus-within:ring-2 focus-within:ring-opacity-50 focus-within:outline-none ${
    error
      ? "border-red-300 focus-within:ring-red-500 focus-within:border-red-500"
      : "border-gray-300 focus-within:ring-blue-500 focus-within:border-blue-500"
  }`;

  return (
    <div className="relative">
      <div className={containerClasses}>
        {value.map((skill, index) => (
          <div
            key={index}
            className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
          >
            <span>{skill}</span>
            <button
              type="button"
              onClick={() => removeSkill(index)}
              className="p-0.5 rounded-full hover:bg-blue-200 text-blue-700"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() =>
            inputValue && setSuggestions.length > 0 && setShowSuggestions(true)
          }
          className={inputClasses}
          placeholder={
            value.length === 0
              ? "Type skills and press Enter or comma to add"
              : ""
          }
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                index === activeSuggestion ? "bg-blue-50" : ""
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}

      {value.length > 0 && (
        <p className="text-xs text-gray-500 mt-1">
          {value.length} skill{value.length !== 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
};

export default SkillsInput;
