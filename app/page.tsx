'use client'
import { useState } from 'react';
import UploadForm from './components/uploadForm';
import BlockList from './components/BlockList';
import { Toaster } from 'react-hot-toast';
export default function Home() {
  const [activeTab, setActiveTab] = useState<'upload' | 'view'>('upload');
  const [reloadBlocks, setReloadBlocks] = useState(false);

  const handleUploadSuccess = () => {
    setReloadBlocks((prev) => !prev);
    setActiveTab('view');
  };

  return (
    <>
     <Toaster position="top-right" reverseOrder={false} />
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-10 px-4">
      <h1 className="text-4xl font-bold text-center text-black mb-10">
        CAD File Block Viewer
      </h1>

      <div className="flex justify-center gap-6 mb-6">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-6 py-2 rounded-full  cursor-pointer font-semibold transition-all duration-200 shadow 
            ${activeTab === 'upload' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-100'}`}
        >
          Upload File
        </button>
        <button
          onClick={() => setActiveTab('view')}
          className={`px-6 py-2 rounded-full  cursor-pointer font-semibold transition-all duration-200 shadow 
            ${activeTab === 'view' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-100'}`}
        >
          View Blocks
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        {activeTab === 'upload' && <UploadForm onUploadSuccess={handleUploadSuccess} />}
        {activeTab === 'view' && <BlockList key={String(reloadBlocks)} />}
      </div>
    </main>
    </>
  );
}
