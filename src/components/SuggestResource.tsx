import { useState } from 'react';

export default function SuggestResourceModal({ onClose }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    tags: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Suggested Resource:', formData);
    setIsModalOpen(false);
  };

  return (
    <>
     <div className="fixed inset-0 bg-gradient-to-tr from-blue-900 via-purple-900 to-blue-950 bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-white mb-4">Suggest a Resource</h2>
        <form>
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
          />
          <input
            type="url"
            placeholder="Link"
            className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
          />
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
