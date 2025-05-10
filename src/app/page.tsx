"use client"
import { useState, useEffect } from 'react';
import { FaFileAudio, FaUpload, FaLanguage, FaFileAlt, FaTimes, FaClock } from 'react-icons/fa';

const API_URL = 'https://transcribe-ai-backend.onrender.com';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [timestamp, setTimestamp] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleDiscardFile = () => {
    setFile(null);
    setTranscript('');
    setLanguage('');
    setTimestamp('');
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('audio', file);

    try {
      const response = await fetch(`${API_URL}/api/transcribe`, {
        method: 'POST',
        body: formData,
      });
      const res = await response.json();
      const data = res.transcript[0];
      console.log(data);
      setTranscript(data.text || '');
      setLanguage(data.language || '');
      setTimestamp(data.timestamp || '');
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
        <FaFileAudio className="text-blue-600" />
        Audio Transcription
      </h1>
      
      <div className="w-full max-w-6xl space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <div className="flex flex-col items-center gap-4">
          {!file ? (
            <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg shadow-lg tracking-wide border border-blue-500 cursor-pointer hover:bg-blue-50 transition-colors">
              <FaUpload className="text-2xl mb-2" />
              <span className="mt-2 text-sm">Select audio file</span>
              <input type="file" accept="audio/*" onChange={handleFileChange} className="hidden" />
            </label>
          ) : (
            <div className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <FaFileAudio className="text-blue-600 text-xl" />
                <span className="text-gray-700 truncate max-w-[200px]">{file.name}</span>
              </div>
              <button
                onClick={handleDiscardFile}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Discard file"
              >
                <FaTimes />
              </button>
            </div>
          )}
          
          <button 
            onClick={handleUpload}
            disabled={!file || isProcessing}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-colors ${
              file && !isProcessing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing Audio...
              </>
            ) : (
              <>
                <FaUpload className="text-lg" />
                Upload and Transcribe
              </>
            )}
          </button>
        </div>

        {isProcessing && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-blue-600 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
            </div>
            <p className="mt-4 text-lg text-gray-600 font-medium">Processing your audio file...</p>
            <p className="text-sm text-gray-500">This may take a few moments</p>
          </div>
        )}

        {(transcript || language || timestamp) && !isProcessing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Left Column - Metadata */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Audio Information</h2>
                {language && (
                  <div className="flex items-center gap-3 mb-4">
                    <FaLanguage className="text-blue-600 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Language</p>
                      <p className="text-gray-800 font-medium">{language}</p>
                    </div>
                  </div>
                )}
                {timestamp && (
                  <div className="flex items-center gap-3">
                    <FaClock className="text-blue-600 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Timestamp</p>
                      <p className="text-gray-800 font-medium">{timestamp}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Transcript */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaFileAlt className="text-blue-600 text-xl" />
                <h2 className="text-xl font-semibold text-gray-800">Transcript</h2>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{transcript}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}