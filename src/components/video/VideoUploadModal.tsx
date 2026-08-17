import React, { useState, useRef } from 'react';
import { Upload, X, Film, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoUploadModal: React.FC<VideoUploadModalProps> = ({ isOpen, onClose }) => {
  const { setUploadedVideo, loadSamplePreset, cameras } = useApp();
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleConfirmUpload = () => {
    if (selectedFile) {
      setUploadedVideo(selectedFile);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-base text-slate-100">Upload Video or Select CCTV Stream</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dropzone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-sky-400 bg-sky-950/30'
              : selectedFile
              ? 'border-sky-500/70 bg-slate-950/60'
              : 'border-slate-700 hover:border-slate-500 bg-slate-950/40'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/quicktime"
            className="hidden"
            onChange={handleFileChange}
          />
          <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
          {selectedFile ? (
            <div>
              <div className="text-sm font-semibold text-sky-300">{selectedFile.name}</div>
              <div className="text-xs text-slate-400 mt-1 font-mono">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB — Ready for AI analysis
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-slate-200">
                Drag and drop your traffic video file here, or{' '}
                <span className="text-sky-400 underline">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">Supports MP4, WebM, MOV</p>
            </div>
          )}
        </div>

        {/* Sample Camera Streams */}
        <div>
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Or Switch to Live Simulated CCTV Feeds:
          </div>
          <div className="grid grid-cols-2 gap-2">
            {cameras.map((cam) => (
              <button
                key={cam.id}
                onClick={() => {
                  loadSamplePreset(cam.id);
                  onClose();
                }}
                className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800 text-left text-xs transition-all cursor-pointer group"
              >
                <div className="font-bold text-slate-200 group-hover:text-sky-400 flex items-center justify-between">
                  <span>{cam.id}</span>
                  <span className="text-[10px] font-mono text-sky-400">● LIVE</span>
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{cam.location}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={!selectedFile}
            onClick={handleConfirmUpload}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              selectedFile
                ? 'bg-sky-600 hover:bg-sky-500 text-white cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            Load & Analyze Video
          </button>
        </div>
      </div>
    </div>
  );
};
