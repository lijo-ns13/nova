import React, { useEffect, useState } from "react";
import { useDebounce } from "../../../../hooks/useDebounce";
import {
  searchSkills,
  addSkill,
  removeSkill,
  getUserSkills,
} from "../../services/SkillService";
import { Plus, X, Search, Star, Zap, Target, TrendingUp } from "lucide-react";

interface Skill {
  id: string;
  title: string;
}

const SkillsManager: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [query, setQuery] = useState<string>("");
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedQuery = useDebounce(query, 200);

  const fetchUserSkills = async () => {
    try {
      setLoading(true);
      const res = await getUserSkills();
      setSkills(res);
    } catch (err) {
      setError("Failed to fetch user skills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSkills();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestedSkills([]);
        setShowSuggestions(false);
        return;
      }
      try {
        const res = await searchSkills(debouncedQuery);
        setSuggestedSkills(res);
        setShowSuggestions(res.length > 0);
      } catch (err) {
        console.log(err);
        setSuggestedSkills([]);
        setShowSuggestions(false);
      }
    };
    fetchSuggestions();
  }, [debouncedQuery]);

  const handleAddSkill = async (skillTitle?: string) => {
    const skillToAdd = skillTitle || query;
    if (!skillToAdd.trim()) return;

    const alreadyAdded = skills.some(
      (s) => s.title.toLowerCase() === skillToAdd.toLowerCase()
    );
    if (alreadyAdded) {
      setError("Skill already added.");
      return;
    }

    try {
      setAddLoading(true);
      const res = await addSkill(skillToAdd);
      setQuery("");
      setShowSuggestions(false);
      setError(null);
      setSkills([...res.skills]);
    } catch (err) {
      console.log(err);
      setError("Failed to add skill.");
    } finally {
      setAddLoading(false);
    }
  };

  const handleRemoveSkill = async (id: string) => {
    try {
      await removeSkill(id);
      setSkills(skills.filter((skill) => skill.id != id));
    } catch (err) {
      console.log(err);
      setError("Failed to remove skill.");
    }
  };

  const getSkillIcon = (index: number) => {
    const icons = [Star, Zap, Target, TrendingUp];
    const IconComponent = icons[index % icons.length];
    return <IconComponent className="w-4 h-4" />;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">
                Skills & Expertise
              </h2>
              <p className="text-gray-600 mt-1">
                Showcase your professional capabilities
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm bg-blue-50 px-3 py-1.5 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">{skills.length} Skills</span>
              </div>
              <div className="flex items-center gap-2 text-sm bg-blue-50 px-3 py-1.5 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">
                  Strength: {Math.min(100, skills.length * 10)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Add Skill Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Add New Skill
            </h3>

            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setError(null);
                    setQuery(e.target.value);
                  }}
                  onFocus={() => setShowSuggestions(suggestedSkills.length > 0)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddSkill();
                  }}
                  placeholder="Type a skill (e.g., React, Python, Leadership)..."
                  className="w-full pl-10 pr-28 py-3 text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-white"
                />
                <button
                  onClick={() => handleAddSkill()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                  disabled={addLoading || !query.trim()}
                >
                  {addLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {addLoading ? "Adding..." : "Add"}
                </button>
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestedSkills.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  <div className="p-2 border-b border-gray-100">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Suggested Skills
                    </p>
                  </div>
                  <ul className="max-h-60 overflow-y-auto divide-y divide-gray-100">
                    {suggestedSkills.map((skill, idx) => (
                      <li key={idx}>
                        <button
                          onClick={() => handleAddSkill(skill)}
                          className="w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 group text-sm"
                        >
                          <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-all duration-150">
                            {getSkillIcon(idx)}
                          </div>
                          <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                            {skill}
                          </span>
                          <Plus className="w-4 h-4 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}
          </div>

          {/* Skills Display */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Your Skills Portfolio
            </h3>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Loading your skills...</span>
                </div>
              </div>
            ) : skills.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  No skills added yet
                </h4>
                <p className="text-gray-500 max-w-md mx-auto text-sm">
                  Start building your skills portfolio by adding your first
                  skill above. Showcase your expertise to stand out!
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {skills.map((skill, index) => (
                    <div
                      key={skill.id}
                      className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                          {getSkillIcon(index)}
                        </div>
                        <button
                          onClick={() => handleRemoveSkill(skill.id)}
                          className="w-7 h-7 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full flex items-center justify-center transition-all duration-200"
                          title="Remove skill"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="font-medium text-gray-800 text-base mb-2">
                        {skill.title}
                      </h4>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000"
                          style={{
                            width: `${Math.min(100, (index + 1) * 15 + 40)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stats Footer */}
                {skills.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-800">
                          {skills.length}
                        </p>
                        <p className="text-xs text-gray-600">Skills Mastered</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <Star className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-800">
                          {Math.min(100, skills.length * 10)}%
                        </p>
                        <p className="text-xs text-gray-600">
                          Profile Strength
                        </p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <Zap className="w-5 h-5 text-purple-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-800">
                          {skills.length > 5
                            ? "Expert"
                            : skills.length > 2
                            ? "Intermediate"
                            : "Beginner"}
                        </p>
                        <p className="text-xs text-gray-600">Skill Level</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsManager;
