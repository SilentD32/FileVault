'use client';

import { useState, type FormEvent, type ChangeEvent } from 'react';
import Link from 'next/link';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json() as { fileName: string; fileSize: number; fileType: string };
      
      // Add to uploaded files list
      const newFile: UploadedFile = {
        name: data.fileName,
        size: data.fileSize,
        type: data.fileType,
        uploadedAt: new Date().toLocaleString(),
      };

      setUploadedFiles([newFile, ...uploadedFiles]);
      setSuccess(`File "${file.name}" uploaded successfully!`);
      setFile(null);

      // Clear file input
      const input = document.getElementById('fileInput') as HTMLInputElement;
      if (input) input.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during upload');
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            File <span className="text-[hsl(280,100%,70%)]">Upload</span>
          </h1>
          <Link
            href="/"
            className="rounded-lg bg-white/10 px-6 py-2 hover:bg-white/20"
          >
            ← Back Home
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Upload Section */}
          <div className="rounded-xl bg-white/10 p-8">
            <h2 className="mb-6 text-2xl font-bold">Upload File</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label
                  htmlFor="fileInput"
                  className="block cursor-pointer rounded-lg border-2 border-dashed border-white/30 p-8 text-center transition hover:border-white/50 hover:bg-white/5"
                >
                  <svg
                    className="mx-auto mb-4 h-12 w-12 text-white/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-lg font-medium">
                    {file ? file.name : 'Click to select or drag and drop'}
                  </p>
                  {file && (
                    <p className="mt-2 text-sm text-white/60">
                      ({formatFileSize(file.size)})
                    </p>
                  )}
                </label>
                <input
                  id="fileInput"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-500/20 p-4 text-red-200">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-lg bg-green-500/20 p-4 text-green-200">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={!file || isLoading}
                className="w-full rounded-lg bg-[hsl(280,100%,70%)] px-6 py-3 font-semibold text-black transition disabled:opacity-50"
              >
                {isLoading ? 'Uploading...' : 'Upload File'}
              </button>
            </form>
          </div>

          {/* Uploaded Files Section */}
          <div className="rounded-xl bg-white/10 p-8">
            <h2 className="mb-6 text-2xl font-bold">
              Uploaded Files ({uploadedFiles.length})
            </h2>

            {uploadedFiles.length === 0 ? (
              <p className="text-white/60">No files uploaded yet</p>
            ) : (
              <div className="space-y-3">
                {uploadedFiles.map((uploadedFile, index) => (
                  <div
                    key={index}
                    className="rounded-lg bg-white/5 p-4 transition hover:bg-white/10"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-white">{uploadedFile.name}</p>
                        <p className="text-sm text-white/60">
                          {formatFileSize(uploadedFile.size)} • {uploadedFile.type}
                        </p>
                        <p className="text-xs text-white/40 mt-1">
                          {uploadedFile.uploadedAt}
                        </p>
                      </div>
                      <svg
                        className="h-5 w-5 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
