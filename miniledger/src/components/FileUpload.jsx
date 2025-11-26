export default function FileUpload() {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 text-center">
      <h2 className="text-xl font-semibold mb-4">Upload JSON File</h2>

      <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg py-10 hover:bg-gray-50">
        <p className="text-gray-700">Drag & drop or click to upload</p>
        <p className="text-sm text-gray-500 mt-2">Only JSON files are allowed</p>

        <input 
          type="file"
          accept=".json"
          className="hidden"
        />
      </label>

      {/* Placeholder for showing file status */}
      <p className="text-gray-500 text-sm mt-4 italic">No file uploaded yet.</p>
    </div>
  );
}
