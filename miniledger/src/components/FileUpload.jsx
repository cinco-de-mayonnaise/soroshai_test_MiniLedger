import { useState } from 'react'

export default function FileUpload() {

  const [curFile, set_curFile] = useState(null);

  
  function loadFile(event)
  {

    const file = event.target.files[0];
    if (!file)
      return;

    set_curFile(file.name);
  }

  function clearLoadedFile()
  {
    // TODO: also clear Ledger Table and Warnings

    set_curFile(null);
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 text-center">
      <h2 className="text-xl font-semibold mb-4">Upload JSON File</h2>
    
      {/* if file not uploaded, TIL you can comment like this lmao */}
      {!curFile && (      
        <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg py-10 hover:bg-gray-50">
        <p className="text-gray-700">Drag & drop or click to upload</p>
        <p className="text-sm text-gray-500 mt-2">Only JSON files are allowed</p>

        <input type="file"
          accept=".json"
          className="hidden"
          onChange={(ev) => loadFile(ev)}
        />
        </label>
      )}
    
      {/* show this instead if a file was uploaded. */}
      {curFile && (
          <div className="flex flex-col items-center space-y-3">
          <p className="text-gray-800 font-medium">
            Currently Open: <span className="font-semibold italic">{curFile}</span>
          </p>

          <button onClick={clearLoadedFile}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Remove File
          </button>
        </div>
      )}
      
    </div>
  );
}
