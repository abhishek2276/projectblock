import { useState, useEffect } from 'react';

const BlockList = () => {
  const [blocks, setBlocks] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true); // NEW

  const blocksPerPage = 8;

  const fetchBlocks = async () => {
    try {
      setLoading(true); // Start loading
      const res = await fetch('http://localhost:5000/api/files/blocks');
      const data = await res.json();
      setBlocks(data.blocks);
    } catch (err) {
      console.error('Failed to fetch blocks', err);
    } finally {
      setLoading(false); // End loading
    }
  };


  const fetchBlockById = async (id) => {
    const res = await fetch(`http://localhost:5000/api/files/blocks/${id}`);
    const data = await res.json();
    setSelectedBlock(data);
    setShowModal(true);
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const filtered = blocks.filter((block) =>
    block.name.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastBlock = currentPage * blocksPerPage;
  const indexOfFirstBlock = indexOfLastBlock - blocksPerPage;
  const currentBlocks = filtered.slice(indexOfFirstBlock, indexOfLastBlock);
  const totalPages = Math.ceil(filtered.length / blocksPerPage);

  return (
    <div className="bg-white p-6 rounded-2xl md:w-[800px] mx-auto shadow-md animate-fade-in relative">
      <div className="flex justify-between flex-col md:flex-row gap-4 md:items-center mb-4">
        <h2 className="text-2xl font-bold text-black">Extracted Blocks</h2>
        <input
          type="text"
          placeholder="Search blocks..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="rounded-full border  text-gray-900 border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 ">
      {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : currentBlocks.length === 0 ? (
          <p className="text-gray-500 text-center">No blocks found.</p>
        ) : (
          currentBlocks.map((block) => (
            <div
              key={block.id}
              className="bg-gray-50 p-3 rounded-lg shadow-sm border relative"
            >
              <div onClick={() => fetchBlockById(block.id)} className="flex justify-between cursor-pointer items-start">
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>Name:</strong> {block.name}
                  </p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap max-h-[80px] overflow-y-auto hide-scrollbar">
                    <strong>Coordinates:</strong>{' '}
                    {JSON.stringify(block.coordinates, null, 2)}
                  </p>
                </div>
                <button
                  onClick={() => fetchBlockById(block.id)}
                  className="text-md bg-gray-300 text-black px-3 py-1 cursor-pointer rounded transition"
                >
                  View
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              } transition`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedBlock && (
        <div className="fixed inset-0 z-50 bg-black/70 bg-opacity-40 text-gray-900 flex items-center justify-center">
          <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-4">
              Block Details - {selectedBlock.name}
            </h3>
            <pre className="bg-gray-100 p-4 rounded max-h-[500px] overflow-y-auto text-sm whitespace-pre-wrap">
                coordinates:
              {JSON.stringify(selectedBlock.coordinates, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockList;
