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
  _id: string;
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
      await addSkill(skillToAdd);
      setQuery("");
      setShowSuggestions(false);
      await fetchUserSkills();
      setError(null);
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
      await fetchUserSkills();
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
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">
                Skills & Expertise
              </h2>
              <p className="text-blue-100 mt-1">
                Showcase your professional capabilities
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-white/80 text-sm">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              {skills.length} Skills Added
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Profile Strength: {Math.min(100, skills.length * 10)}%
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Add Skill Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Add New Skill
            </h3>

            <div className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setError(null);
                    setQuery(e.target.value);
                  }}
                  onFocus={() => setShowSuggestions(suggestedSkills.length > 0)}
                  placeholder="Type a skill (e.g., React, Python, Leadership)..."
                  className="w-full pl-12 pr-32 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-0 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                <button
                  onClick={() => handleAddSkill()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-600">
                      Suggested Skills
                    </p>
                  </div>
                  <ul className="max-h-60 overflow-y-auto">
                    {suggestedSkills.map((skill, idx) => (
                      <li key={idx}>
                        <button
                          onClick={() => handleAddSkill(skill)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 group"
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-150">
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
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}
          </div>

          {/* Skills Display */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Your Skills Portfolio
            </h3>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-lg">Loading your skills...</span>
                </div>
              </div>
            ) : skills.length === 0 ? (
              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <Target className="w-10 h-10 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-700 mb-2">
                  No skills added yet
                </h4>
                <p className="text-gray-500 max-w-md mx-auto">
                  Start building your skills portfolio by adding your first
                  skill above. Showcase your expertise to stand out!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {skills.map((skill, index) => (
                  <div
                    key={skill._id}
                    className="group relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-200 hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                        {getSkillIcon(index)}
                      </div>
                      <button
                        onClick={() => handleRemoveSkill(skill._id)}
                        className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                        title="Remove skill"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="font-semibold text-gray-800 text-lg mb-2">
                      {skill.title}
                    </h4>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                        style={{
                          width: `${Math.min(100, (index + 1) * 15 + 40)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats Footer */}
          {skills.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {skills.length}
                  </p>
                  <p className="text-sm text-gray-600">Skills Mastered</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {Math.min(100, skills.length * 10)}%
                  </p>
                  <p className="text-sm text-gray-600">Profile Strength</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {skills.length > 5
                      ? "Expert"
                      : skills.length > 2
                      ? "Intermediate"
                      : "Beginner"}
                  </p>
                  <p className="text-sm text-gray-600">Skill Level</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsManager;
