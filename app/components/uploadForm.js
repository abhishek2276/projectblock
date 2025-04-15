import { useState } from 'react';
import toast from 'react-hot-toast';

const UploadForm = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a DXF file');
      return;
    }

    const formData = new FormData();
    formData.append('dxfFile', file);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        toast.success(result.message || 'File uploaded successfully!');
        onUploadSuccess();
      } else {
        toast.error(result.message || 'Upload failed!');
      }
    } catch (err) {
      toast.error('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-[800px] mx-auto bg-white p-8 rounded-2xl shadow-xl border border-blue-100 animate-fade-in transform transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 text-center">
        📤 Upload DXF File
      </h2>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select your CAD file (accepts only .dxf)
        </label>
        <input
          type="file"
          accept=".dxf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-blue-500 file:to-blue-700 file:text-white hover:file:brightness-110 transition-all"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="mx-auto py-2 px-4 cursor-pointer rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="animate-pulse">Uploading...</span>
        ) : (
          'Upload File'
        )}
      </button>
    </div>
  );
};

export default UploadForm;
