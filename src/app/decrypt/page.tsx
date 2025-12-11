"use client";

import { useState, type FormEvent, type ChangeEvent } from 'react';
import Link from 'next/link';

interface DecryptState {
  encryptedFile: File | null;
  keyFile: File | null;
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

export default function DecryptPage() {
  const [state, setState] = useState<DecryptState>({
    encryptedFile: null,
    keyFile: null,
    isLoading: false,
    error: null,
    success: null,
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fileType: 'encrypted' | 'key') => {
    const file = e.target.files?.[0];
    if (file) {
      setState(prev => ({
        ...prev,
        [fileType === 'encrypted' ? 'encryptedFile' : 'keyFile']: file,
        error: null,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!state.encryptedFile || !state.keyFile) {
      setState(prev => ({ ...prev, error: 'Please select both encrypted file and key file' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null, success: null }));

    try {
      const formData = new FormData();
      formData.append('encryptedFile', state.encryptedFile);
      formData.append('keyFile', state.keyFile);

      const response = await fetch('/api/decrypt', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json() as { error: string };
        throw new Error(error.error || 'Decryption failed');
      }

      // Get the decrypted file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Extract original filename from the response
      const contentDisposition = response.headers.get('content-disposition');
      const fileName = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '') ?? 'decrypted-file'
        : 'decrypted-file';
      
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setState(prev => ({
        ...prev,
        success: 'File decrypted successfully! Download started.',
        encryptedFile: null,
        keyFile: null,
      }));

      // Clear file inputs
      const encInput = document.getElementById('encryptedFileInput') as HTMLInputElement;
      const keyInput = document.getElementById('keyFileInput') as HTMLInputElement;
      if (encInput) encInput.value = '';
      if (keyInput) keyInput.value = '';
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'An error occurred during decryption',
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-md bg-black/20">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
                  🔓
                </div>
                <h1 className="text-2xl font-bold">FileVault Decrypt</h1>
              </div>
              <Link href="/" className="rounded-lg bg-white/10 px-6 py-2 hover:bg-white/20 transition">
                ← Back to Upload
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-purple-100 to-blue-200">
              Decrypt Your Files
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Upload your encrypted file and the corresponding key file to decrypt and download the original file.
            </p>
          </div>

          {/* Decrypt Section */}
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-8 shadow-2xl hover:shadow-purple-500/20 transition-all">
              <h2 className="text-2xl font-bold mb-8">Decryption Tool</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Encrypted File Upload */}
                <div>
                  <label htmlFor="encryptedFileInput" className="block text-sm font-semibold mb-3">
                    Encrypted File (.enc)
                  </label>
                  <div className="relative rounded-xl border-2 border-dashed border-white/30 hover:border-white/50 hover:bg-white/5 p-6 text-center cursor-pointer transition">
                    <label htmlFor="encryptedFileInput" className="cursor-pointer block">
                      <svg
                        className="mx-auto mb-3 h-10 w-10 text-blue-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 16v-4m0 0V8m0 4h4m-4 0H8"
                        />
                      </svg>
                      <p className="text-sm font-semibold text-white">
                        {state.encryptedFile ? state.encryptedFile.name : 'Click to select encrypted file'}
                      </p>
                    </label>
                    <input
                      id="encryptedFileInput"
                      type="file"
                      accept=".enc"
                      onChange={(e) => handleFileChange(e, 'encrypted')}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Key File Upload */}
                <div>
                  <label htmlFor="keyFileInput" className="block text-sm font-semibold mb-3">
                    Key File (.key.txt)
                  </label>
                  <div className="relative rounded-xl border-2 border-dashed border-white/30 hover:border-white/50 hover:bg-white/5 p-6 text-center cursor-pointer transition">
                    <label htmlFor="keyFileInput" className="cursor-pointer block">
                      <svg
                        className="mx-auto mb-3 h-10 w-10 text-green-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 16v-4m0 0V8m0 4h4m-4 0H8"
                        />
                      </svg>
                      <p className="text-sm font-semibold text-white">
                        {state.keyFile ? state.keyFile.name : 'Click to select key file'}
                      </p>
                    </label>
                    <input
                      id="keyFileInput"
                      type="file"
                      accept=".txt"
                      onChange={(e) => handleFileChange(e, 'key')}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Status Messages */}
                {state.error && (
                  <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-4 text-red-200 flex items-center gap-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {state.error}
                  </div>
                )}

                {state.success && (
                  <div className="rounded-lg bg-green-500/20 border border-green-500/50 p-4 text-green-200 flex items-center gap-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {state.success}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!state.encryptedFile || !state.keyFile || state.isLoading}
                  className="w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 font-bold text-white transition hover:shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Decrypting...
                    </span>
                  ) : (
                    '🔓 Decrypt & Download'
                  )}
                </button>
              </form>

              {/* Info Box */}
              <div className="mt-8 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <h3 className="font-semibold text-blue-200 mb-2">How to use:</h3>
                <ol className="text-sm text-blue-100 space-y-1 list-decimal list-inside">
                  <li>Upload your encrypted .enc file</li>
                  <li>Upload the corresponding .key.txt file</li>
                  <li>Click &quot;Decrypt &amp; Download&quot;</li>
                  <li>Your original file will be downloaded automatically</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
