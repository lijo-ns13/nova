import { useEffect, useState, useRef, type KeyboardEvent } from "react";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";

interface Location {
  place_id: string;
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state_district?: string;
    state?: string;
    country?: string;
    postcode?: string;
    road?: string;
    house_number?: string;
  };
}

interface Props {
  onSelect: (locationName: string) => void;
  placeholder?: string;
  className?: string;
  countryCodes?: string;
  apiKey: string;
  initialValue?: string; // Add this
}

export function LocationSearchInput({
  onSelect,
  placeholder = "Search for your city...",
  className = "",
  countryCodes = "in",
  apiKey,
  initialValue = "",
}: Props) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(query.trim(), 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchLocations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${encodeURIComponent(
            debouncedQuery
          )}&countrycodes=${countryCodes}&format=json&addressdetails=1&limit=8`
        );

        if (!res.ok) throw new Error("Failed to fetch locations");

        const data: Location[] = await res.json();
        setSuggestions(data);
      } catch (err) {
        setError("Unable to load locations. Please try again.");
        setSuggestions([]);
      } finally {
        setIsLoading(false);
        setActiveIndex(-1);
      }
    };

    fetchLocations();
  }, [debouncedQuery, countryCodes, apiKey]);

  const getSimpleDisplayName = (loc: Location): string => {
    const { address } = loc;

    // Priority: city > town > village
    const cityName = address.city || address.town || address.village;
    const stateName = address.state || address.state_district;

    if (cityName && stateName) {
      return `${cityName}, ${stateName}`;
    } else if (cityName) {
      return cityName;
    }

    // Fallback to a clean version of display_name
    const parts = loc.display_name.split(",");
    return parts.slice(0, 2).join(", ").trim();
  };

  const handleSelect = (location: Location) => {
    const displayName = getSimpleDisplayName(location);
    setQuery(displayName);
    setSuggestions([]);
    setIsFocused(false);
    onSelect(displayName);
    inputRef.current?.blur();
  };

  const clearInput = () => {
    setQuery("");
    setSuggestions([]);
    setError(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          e.preventDefault();
          handleSelect(suggestions[activeIndex]);
        }
        break;
      case "Escape":
        setSuggestions([]);
        setActiveIndex(-1);
        setIsFocused(false);
        inputRef.current?.blur();
        break;
    }
  };

  useEffect(() => {
    if (activeIndex >= 0 && dropdownRef.current) {
      const activeItem = dropdownRef.current.children[
        activeIndex
      ] as HTMLElement;
      if (activeItem) {
        activeItem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex]);

  return (
    <div className={`relative ${className}`}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-2xl bg-white shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none placeholder-gray-400"
        />

        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
          ) : (
            query && (
              <button
                onClick={clearInput}
                className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )
          )}
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl flex items-center">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
          {error}
        </div>
      )}

      {isFocused && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2">
          <ul
            ref={dropdownRef}
            className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm"
          >
            {suggestions.map((loc, index) => {
              const displayName = getSimpleDisplayName(loc);
              return (
                <li
                  key={loc.place_id}
                  className={`group cursor-pointer transition-all duration-150 ${
                    index === activeIndex
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : "hover:bg-gray-50 border-l-4 border-transparent"
                  }`}
                  onClick={() => handleSelect(loc)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <div className="flex items-center px-6 py-4">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full mr-4 transition-colors ${
                        index === activeIndex
                          ? "bg-blue-100"
                          : "bg-gray-100 group-hover:bg-gray-200"
                      }`}
                    >
                      <MapPin
                        className={`h-5 w-5 ${
                          index === activeIndex
                            ? "text-blue-600"
                            : "text-gray-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-lg">
                        {displayName}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {isFocused &&
        query.length >= 2 &&
        !isLoading &&
        suggestions.length === 0 &&
        !error && (
          <div className="absolute z-50 w-full mt-2">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No locations found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try a different search term
              </p>
            </div>
          </div>
        )}
    </div>
  );
}
