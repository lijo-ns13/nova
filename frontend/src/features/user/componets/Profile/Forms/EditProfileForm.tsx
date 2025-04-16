import { useState } from "react";

interface EditProfileFormProps {
  initialData: {
    name: string;
    headline: string;
    about: string;
  };
  onSave: (updatedData: {
    name: string;
    headline: string;
    about: string;
  }) => void;
  onClose: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  initialData,
  onSave,
  onClose,
}) => {
  const [user, setUser] = useState(initialData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(user);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        name="name"
        placeholder="Enter your name"
        value={user.name}
        onChange={handleChange}
        className="border rounded p-2"
      />
      <input
        type="text"
        name="headline"
        placeholder="Enter your headline"
        value={user.headline}
        onChange={handleChange}
        className="border rounded p-2"
      />
      <textarea
        name="about"
        placeholder="Enter about yourself"
        value={user.about}
        onChange={handleChange}
        className="border rounded p-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Save
      </button>
    </form>
  );
};

export default EditProfileForm;
