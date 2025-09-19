import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { searchSkills } from "../../services/SkillService";

interface SkillsInputProps {
  value: string[];
  onChange: (skills: string[]) => void;
  error?: boolean;
}

const SkillsInput: React.FC<SkillsInputProps> = ({
  value,
  onChange,
  error,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  /** fetch suggestions whenever input changes */
  useEffect(() => {
    const getSuggestions = async () => {
      if (inputValue.trim().length > 0) {
        const skills = await searchSkills(inputValue);
        setSuggestions(skills);
        setShowSuggestions(skills.length > 0);
        setActiveSuggestion(0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };
    getSuggestions();
  }, [inputValue]);

  /** close dropdown on outside click */
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addSkill = (skill: string) => {
    const normalized =
      skill.trim().charAt(0).toUpperCase() + skill.trim().slice(1);
    if (!value.some((s) => s.toLowerCase() === normalized.toLowerCase())) {
      onChange([...value, normalized]);
    }
    setInputValue("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeSkill = (index: number) =>
    onChange(value.filter((_, i) => i !== index));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (showSuggestions && suggestions.length > 0)
        addSkill(suggestions[activeSuggestion]);
      else if (inputValue.trim()) addSkill(inputValue.trim());
    } else if (e.key === ",") {
      e.preventDefault();
      if (inputValue.trim()) addSkill(inputValue.trim());
    } else if (e.key === "ArrowDown") {
      setActiveSuggestion((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Escape") setShowSuggestions(false);
    else if (e.key === "Backspace" && !inputValue && value.length > 0)
      onChange(value.slice(0, -1));
  };

  return (
    <div className="relative">
      <div
        className={`flex flex-wrap gap-2 p-2 border rounded-md focus-within:ring-2 ${
          error
            ? "border-red-300 focus-within:ring-red-500"
            : "border-gray-300 focus-within:ring-blue-500"
        }`}
      >
        {value.map((skill, i) => (
          <div
            key={i}
            className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
          >
            <span>{skill}</span>
            <button
              type="button"
              onClick={() => removeSkill(i)}
              className="p-0.5 rounded-full hover:bg-blue-200 text-blue-700"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() =>
            inputValue && suggestions.length > 0 && setShowSuggestions(true)
          }
          placeholder={
            value.length === 0
              ? "Type skills and press Enter or comma to add"
              : ""
          }
          className={`flex-1 min-w-[100px] outline-none bg-transparent ${
            error ? "placeholder:text-red-400" : "placeholder:text-gray-400"
          }`}
        />
      </div>

      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((s, i) => (
            <div
              key={i}
              onClick={() => addSkill(s)}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                i === activeSuggestion ? "bg-blue-50" : ""
              }`}
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillsInput;
