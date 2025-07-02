import { useState, useEffect } from "react";
import { useDebounce } from "../../../../hooks/useDebounce";
import axios from "axios";

interface Skill {
  _id: string;
  title: string;
}

const SkillsManager = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch user's skills on component mount
  useEffect(() => {
    const fetchUserSkills = async () => {
      try {
        setLoading(true);
        const response = await fetchUserSkills();
        setUserSkills(response.data.data);
      } catch (err) {
        setError("Failed to fetch your skills");
      } finally {
        setLoading(false);
      }
    };

    fetchUserSkills();
  }, []);

  // Search for skills when debounced query changes
  useEffect(() => {
    const searchSkills = async () => {
      if (debouncedSearchQuery.trim() === "") {
        setSkills([]);
        return;
      }

      try {
        setLoading(true);
        const response = await searchSkills();
        setSkills(response.data);
      } catch (err) {
        setError("Failed to search skills");
      } finally {
        setLoading(false);
      }
    };

    searchSkills();
  }, [debouncedSearchQuery]);

  const addSkill = async (skillTitle: string) => {
    try {
      setLoading(true);
      await axios.post("/api/skills/add", { title: skillTitle });

      // Update local state
      const newSkill = { _id: Date.now().toString(), title: skillTitle }; // Temporary ID
      setUserSkills([...userSkills, newSkill]);

      // Clear search
      setSearchQuery("");
      setSkills([]);

      setSuccess("Skill added successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to add skill");
    } finally {
      setLoading(false);
    }
  };

  const removeSkill = async (skillId: string) => {
    try {
      setLoading(true);
      await axios.post("/api/skills/remove", { skillId });

      // Update local state
      setUserSkills(userSkills.filter((skill) => skill._id !== skillId));

      setSuccess("Skill removed successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to remove skill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Skills</h2>

      {/* Error and Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Current Skills List */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-3">
          Current Skills
        </h3>
        {loading && userSkills.length === 0 ? (
          <p className="text-gray-500">Loading your skills...</p>
        ) : userSkills.length === 0 ? (
          <p className="text-gray-500">You haven't added any skills yet.</p>
        ) : (
          <ul className="space-y-2">
            {userSkills.map((skill) => (
              <li
                key={skill._id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-gray-700">{skill.title}</span>
                <button
                  onClick={() => removeSkill(skill._id)}
                  disabled={loading}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Skills Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-3">
          Add New Skill
        </h3>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for skills to add..."
          disabled={loading}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        />

        {/* Search Results */}
        {skills.length > 0 && (
          <div className="mb-4">
            <ul className="space-y-2">
              {skills.map((skill) => (
                <li
                  key={skill._id}
                  className="flex justify-between items-center p-3 bg-blue-50 rounded-lg"
                >
                  <span className="text-gray-700">{skill.title}</span>
                  <button
                    onClick={() => addSkill(skill.title)}
                    disabled={
                      loading || userSkills.some((s) => s.title === skill.title)
                    }
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Option to add custom skill if not found in search */}
        {searchQuery.trim() !== "" && skills.length === 0 && !loading && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-700 mb-2">
              Skill not found? Add it as a new skill:
            </p>
            <button
              onClick={() => addSkill(searchQuery)}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Add "{searchQuery}" as a new skill
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsManager;
