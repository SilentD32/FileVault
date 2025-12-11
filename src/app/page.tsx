'use client';

import { useCallback, useState, useEffect } from "react";

type Page = "encrypt" | "decrypt";

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const Logo = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
    </defs>
    <path
      d="M50 5 L88 22 C91 23.5 93 26 93 30 L93 55 C93 75 72 88 50 96 C28 88 7 75 7 55 L7 30 C7 26 9 23.5 12 22 Z"
      fill="url(#logoGrad)"
    />
    <path
      d="M50 15 L80 28 L80 55 C80 70 65 80 50 86 C35 80 20 70 20 55 L20 28 Z"
      fill="#1E3A8A"
      opacity="0.25"
    />
    <rect x="38" y="40" width="24" height="28" rx="3" fill="white"/>
    <rect x="38" y="40" width="24" height="10" fill="#DBEAFE" rx="3"/>
    <circle cx="50" cy="58" r="5" fill="#3B82F6"/>
    <rect x="48" y="58" width="4" height="7" rx="1" fill="#3B82F6"/>
  </svg>
);

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => setPhase(3), 4300);
    const t4 = setTimeout(() => onComplete(), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 bg-[#0B0F1A] z-[100] flex items-center justify-center transition-opacity duration-700 ease-out ${phase >= 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full transition-all duration-1500 ${phase >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
          <div className="absolute inset-0 bg-blue-600/10 rounded-full blur-[150px] animate-pulse" />
        </div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full transition-all duration-1000 delay-300 ${phase >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
          <div className="absolute inset-0 bg-blue-500/15 rounded-full blur-[80px]" />
        </div>
      </div>

      <div className="relative flex flex-col items-center">
        <div className={`transition-all duration-1000 ease-out ${phase >= 1 ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-12'}`}>
          <div className="relative">
            <svg width="160" height="160" viewBox="0 0 100 100" fill="none" className={`transition-all duration-1000 ${phase >= 1 ? 'drop-shadow-[0_0_60px_rgba(59,130,246,0.5)]' : ''}`}>
              <defs>
                <linearGradient id="splashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#1D4ED8" />
                </linearGradient>
              </defs>
              <path d="M50 5 L88 22 C91 23.5 93 26 93 30 L93 55 C93 75 72 88 50 96 C28 88 7 75 7 55 L7 30 C7 26 9 23.5 12 22 Z" fill="url(#splashGrad)" />
              <path d="M50 15 L80 28 L80 55 C80 70 65 80 50 86 C35 80 20 70 20 55 L20 28 Z" fill="#1E3A8A" opacity="0.25" />
              <rect x="38" y="40" width="24" height="28" rx="3" fill="white" className={`transition-all duration-700 delay-300 ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}/>
              <rect x="38" y="40" width="24" height="10" fill="#DBEAFE" rx="3" className={`transition-all duration-700 delay-500 ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}/>
              <circle cx="50" cy="58" r="5" fill="#3B82F6" className={`transition-all duration-700 delay-700 ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}/>
              <rect x="48" y="58" width="4" height="7" rx="1" fill="#3B82F6" className={`transition-all duration-700 delay-700 ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}/>
            </svg>
            <div className={`absolute -inset-8 border border-blue-400/30 rounded-full transition-all duration-1000 ${phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} style={{ animation: phase >= 1 ? 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' : 'none' }} />
            <div className={`absolute -inset-16 border border-blue-400/10 rounded-full transition-all duration-1000 delay-500 ${phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
          </div>
        </div>

        <div className={`mt-10 text-center transition-all duration-800 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h1 className="text-5xl font-bold text-white tracking-tight">FileVault</h1>
          <p className="text-blue-400/60 text-sm mt-4 tracking-[0.3em] uppercase font-light">Secure File Encryption</p>
        </div>

        <div className={`mt-16 transition-all duration-700 ${phase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }} />
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1s' }} />
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1s' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const LinkedInIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const bytesToHex = (bytes: Uint8Array) =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

const hexToBytes = (hex: string): Uint8Array => {
  const clean = hex.replace(/\s/g, '');
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.substr(i, 2), 16);
  }
  return bytes;
};

const downloadBlob = (data: ArrayBuffer | string, filename: string, mimeType: string) => {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};

export default function FileVaultApp() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>("encrypt");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [decryptFile, setDecryptFile] = useState<File | null>(null);
  const [keyFile, setKeyFile] = useState<File | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptComplete, setDecryptComplete] = useState(false);
  const [encryptedBuffer, setEncryptedBuffer] = useState<ArrayBuffer | null>(null);
  const [encryptionKeyHex, setEncryptionKeyHex] = useState<string>("");
  const [ivHex, setIvHex] = useState<string>("");
  const [originalFileName, setOriginalFileName] = useState<string>("");
  const [decryptedBuffer, setDecryptedBuffer] = useState<ArrayBuffer | null>(null);
  const [decryptedFileName, setDecryptedFileName] = useState<string>("");
  const [decryptError, setDecryptError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setSelectedFile(e.dataTransfer.files[0]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
  };

  const handleEncrypt = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    try {
      const fileBuffer = await selectedFile.arrayBuffer();
      const keyBytes = crypto.getRandomValues(new Uint8Array(32));
      const ivBytes = crypto.getRandomValues(new Uint8Array(16));
      const cryptoKey = await crypto.subtle.importKey("raw", keyBytes, { name: "AES-CBC" }, false, ["encrypt"]);
      const encrypted = await crypto.subtle.encrypt({ name: "AES-CBC", iv: ivBytes }, cryptoKey, fileBuffer);
      setEncryptionKeyHex(bytesToHex(keyBytes));
      setIvHex(bytesToHex(ivBytes));
      setOriginalFileName(selectedFile.name);
      setEncryptedBuffer(encrypted);
      setTimeout(() => { setIsProcessing(false); setIsComplete(true); }, 800);
    } catch (error) {
      console.error("Encryption error:", error);
      setIsProcessing(false);
    }
  };

  const handleDownloadEncryptedFile = () => {
    if (!encryptedBuffer || !originalFileName) return;
    downloadBlob(encryptedBuffer, `${originalFileName}.encrypted`, "application/octet-stream");
  };

  const handleDownloadKey = () => {
    if (!encryptionKeyHex || !ivHex || !originalFileName) return;
    const keyData = `Key (Hex): ${encryptionKeyHex}\nIV (Hex): ${ivHex}\nOriginal Filename: ${originalFileName}\n`;
    downloadBlob(keyData, `${originalFileName}.key.txt`, "text/plain");
  };

  const handleDecrypt = async () => {
    if (!decryptFile || !keyFile) return;
    setDecryptError(null);
    setIsDecrypting(true);
    try {
      const keyContent = await keyFile.text();
      const keyRe = /Key\s*\(?Hex\)?:\s*([a-fA-F0-9]+)/i;
      const ivRe = /IV\s*\(?Hex\)?:\s*([a-fA-F0-9]+)/i;
      const filenameRe = /Original\s*Filename:\s*(.+)/i;
      const keyMatch = keyRe.exec(keyContent);
      const ivMatch = ivRe.exec(keyContent);
      const filenameMatch = filenameRe.exec(keyContent);
      if (!keyMatch || !ivMatch) throw new Error("Invalid key file format. Please use the .key.txt file generated during encryption.");
      const keyHex = keyMatch[1] as string;
      const ivHexValue = ivMatch[1] as string;
      const filename = filenameMatch ? (filenameMatch[1] as string).trim() : decryptFile.name.replace(".encrypted", "");
      if (keyHex.length !== 64) throw new Error(`Invalid key length: expected 64 characters, got ${keyHex.length}`);
      if (ivHexValue.length !== 32) throw new Error(`Invalid IV length: expected 32 characters, got ${ivHexValue.length}`);
      const keyBytes = hexToBytes(keyHex);
      const ivBytes = hexToBytes(ivHexValue);
      const encryptedData = await decryptFile.arrayBuffer();
      const cryptoKey = await crypto.subtle.importKey("raw", keyBytes as BufferSource, { name: "AES-CBC" }, false, ["decrypt"]);
      const decrypted = await crypto.subtle.decrypt({ name: "AES-CBC", iv: ivBytes as BufferSource }, cryptoKey, encryptedData as BufferSource);
      setDecryptedBuffer(decrypted);
      setDecryptedFileName(filename);
      setTimeout(() => { setIsDecrypting(false); setDecryptComplete(true); }, 800);
    } catch (error) {
      console.error("Decryption error:", error);
      const msg = error instanceof Error ? error.message : "Invalid key file or corrupted data";
      setDecryptError(msg);
      setIsDecrypting(false);
    }
  };

  const handleDownloadDecryptedFile = () => {
    if (!decryptedBuffer) return;
    downloadBlob(decryptedBuffer, decryptedFileName || "decrypted-file", "application/octet-stream");
  };

  const resetState = () => {
    setSelectedFile(null);
    setIsComplete(false);
    setIsProcessing(false);
    setDecryptFile(null);
    setKeyFile(null);
    setIsDecrypting(false);
    setDecryptComplete(false);
    setEncryptedBuffer(null);
    setEncryptionKeyHex("");
    setIvHex("");
    setOriginalFileName("");
    setDecryptedBuffer(null);
    setDecryptedFileName("");
    setDecryptError(null);
  };

  const teamMembers = [
    { name: "Abdullah Alkathiri", url: "https://www.linkedin.com/in/aalkathiri/" },
    { name: "Abdulaziz Alqudaimi", url: "https://www.linkedin.com/in/abdulaziz-alqudaimi/" },
    { name: "Faisal Alotaibi", url: "https://www.linkedin.com/in/ftalotaibi/" },
    { name: "Saud Alateeq", url: "#" },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white font-sans flex flex-col">
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -right-32 -top-32 h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-[150px]" />
        <div className="absolute -left-32 top-1/2 h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[150px]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <nav className="border-b border-white/5 backdrop-blur-xl bg-[#0B0F1A]/80 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Logo size={44} />
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">FileVault</h1>
                  <p className="text-[10px] text-blue-400/60 tracking-[0.2em] uppercase">Secure Encryption</p>
                </div>
              </div>
              <div className="flex gap-1 bg-[#111827] p-1 rounded-xl border border-white/5">
                <button onClick={() => { setCurrentPage("encrypt"); resetState(); }} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${currentPage === "encrypt" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-gray-400 hover:text-white"}`}>Encrypt</button>
                <button onClick={() => { setCurrentPage("decrypt"); resetState(); }} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${currentPage === "decrypt" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-gray-400 hover:text-white"}`}>Decrypt</button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-6 py-16 flex-1 w-full">
          {currentPage === "encrypt" ? (
            <div className="space-y-8">
              <div className="text-center space-y-5">
                <div className="flex justify-center"><Logo size={90} /></div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Encrypt Your Files</h2>
                  <p className="text-gray-400 mt-3 max-w-md mx-auto">Military-grade AES-256-CBC encryption to protect your sensitive files</p>
                </div>
              </div>

              {!isComplete ? (
                <div className="space-y-5">
                  <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 ${dragActive ? "border-blue-500 bg-blue-500/10 scale-[1.01]" : selectedFile ? "border-emerald-500/50 bg-emerald-500/5" : "border-[#1E2A3F] bg-[#0F1520] hover:border-[#2A3A52]"}`}>
                    <input type="file" onChange={handleFileSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="p-12 text-center">
                      {selectedFile ? (
                        <div className="space-y-4">
                          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </div>
                          <div>
                            <p className="text-white font-medium">{selectedFile.name}</p>
                            <p className="text-gray-500 text-sm mt-1">{formatFileSize(selectedFile.size)}</p>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }} className="text-gray-500 hover:text-red-400 text-sm transition-colors">Remove</button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#1A2332] flex items-center justify-center">
                            <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                          </div>
                          <div>
                            <p className="text-white font-medium">Drop your file here</p>
                            <p className="text-gray-500 text-sm mt-1">or click to browse</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <button onClick={handleEncrypt} disabled={!selectedFile || isProcessing} className={`w-full py-4 rounded-xl font-semibold transition-all ${selectedFile && !isProcessing ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 active:scale-[0.99]" : "bg-[#1A2332] text-gray-600 cursor-not-allowed"}`}>
                    {isProcessing ? (
                      <div className="flex items-center justify-center gap-3">
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                        <span>Encrypting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        <span>Encrypt File</span>
                      </div>
                    )}
                  </button>
                </div>
              ) : (
                <div className="bg-[#0F1520] rounded-2xl border border-[#1E2A3F] p-8">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Encryption Complete!</h3>
                      <p className="text-gray-400 text-sm mt-1">Your file is now protected with AES-256-CBC</p>
                    </div>
                  </div>
                  <div className="mt-8 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={handleDownloadEncryptedFile} className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        <span>Download File</span>
                      </button>
                      <button type="button" onClick={handleDownloadKey} className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#1A2332] text-white font-medium border border-[#2A3A52] hover:bg-[#222D40] transition-all">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>
                        <span>Download Key</span>
                      </button>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mt-4">
                      <div className="flex gap-3">
                        <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                        <div>
                          <p className="text-amber-400 font-medium text-sm">Important</p>
                          <p className="text-amber-400/70 text-sm mt-0.5">Keep your encryption key safe. Without it, you cannot decrypt your file.</p>
                        </div>
                      </div>
                    </div>
                    <button type="button" onClick={resetState} className="w-full py-3 text-gray-500 hover:text-white transition-colors text-sm mt-2">Encrypt another file</button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 mt-10">
                {[
                  { icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z", title: "AES-256", desc: "Military-grade" },
                  { icon: "M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z", title: "Unique Key", desc: "Per file" },
                  { icon: "M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88", title: "No Storage", desc: "100% Private" },
                ].map((f, i) => (
                  <div key={i} className="bg-[#0F1520] rounded-xl p-5 border border-[#1E2A3F] text-center">
                    <div className="w-10 h-10 mx-auto rounded-lg bg-[#1A2332] flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d={f.icon} /></svg>
                    </div>
                    <h4 className="text-white font-semibold text-sm">{f.title}</h4>
                    <p className="text-gray-500 text-xs mt-0.5">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center space-y-5">
                <div className="flex justify-center"><Logo size={90} /></div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Decrypt Your Files</h2>
                  <p className="text-gray-400 mt-3 max-w-md mx-auto">Upload your encrypted file along with the encryption key to restore the original</p>
                </div>
              </div>

              {!decryptComplete ? (
                <div className="space-y-5">
                  {decryptError && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                      <div className="flex gap-3">
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                        <div>
                          <p className="text-red-400 font-medium text-sm">Decryption Error</p>
                          <p className="text-red-400/70 text-sm mt-0.5">{decryptError}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-gray-400 text-sm font-medium px-1">Encrypted File</label>
                      <div className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer ${decryptFile ? "border-emerald-500/50 bg-emerald-500/5" : "border-[#1E2A3F] bg-[#0F1520] hover:border-[#2A3A52]"}`}>
                        <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => { if (e.target.files?.[0]) { setDecryptFile(e.target.files[0]); setDecryptError(null); }}} />
                        <div className="p-6 text-center">
                          {decryptFile ? (
                            <div className="space-y-2">
                              <div className="w-10 h-10 mx-auto rounded-lg bg-emerald-500/10 flex items-center justify-center"><svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></div>
                              <p className="text-white text-sm font-medium truncate">{decryptFile.name}</p>
                              <p className="text-gray-500 text-xs">{formatFileSize(decryptFile.size)}</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="w-10 h-10 mx-auto rounded-lg bg-[#1A2332] flex items-center justify-center"><svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg></div>
                              <p className="text-white text-sm font-medium">Encrypted file</p>
                              <p className="text-gray-500 text-xs">.encrypted</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-gray-400 text-sm font-medium px-1">Encryption Key</label>
                      <div className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer ${keyFile ? "border-emerald-500/50 bg-emerald-500/5" : "border-[#1E2A3F] bg-[#0F1520] hover:border-[#2A3A52]"}`}>
                        <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => { if (e.target.files?.[0]) { setKeyFile(e.target.files[0]); setDecryptError(null); }}} />
                        <div className="p-6 text-center">
                          {keyFile ? (
                            <div className="space-y-2">
                              <div className="w-10 h-10 mx-auto rounded-lg bg-emerald-500/10 flex items-center justify-center"><svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></div>
                              <p className="text-white text-sm font-medium truncate">{keyFile.name}</p>
                              <p className="text-gray-500 text-xs">{formatFileSize(keyFile.size)}</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="w-10 h-10 mx-auto rounded-lg bg-[#1A2332] flex items-center justify-center"><svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg></div>
                              <p className="text-white text-sm font-medium">Key file</p>
                              <p className="text-gray-500 text-xs">.key.txt</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button type="button" onClick={handleDecrypt} disabled={!decryptFile || !keyFile || isDecrypting} className={`w-full py-4 rounded-xl font-semibold transition-all ${decryptFile && keyFile && !isDecrypting ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 active:scale-[0.99]" : "bg-[#1A2332] text-gray-600 cursor-not-allowed"}`}>
                    {isDecrypting ? (
                      <div className="flex items-center justify-center gap-3">
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                        <span>Decrypting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                        <span>Decrypt File</span>
                      </div>
                    )}
                  </button>
                  <div className="bg-[#0F1520] rounded-xl p-6 border border-[#1E2A3F]">
                    <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>
                      How it works
                    </h4>
                    <ol className="space-y-3 text-gray-400 text-sm">
                      <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-[#1A2332] text-blue-400 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span><span>Upload the encrypted file (.encrypted)</span></li>
                      <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-[#1A2332] text-blue-400 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span><span>Upload the encryption key (.key.txt)</span></li>
                      <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-[#1A2332] text-blue-400 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span><span>Click decrypt and download your file</span></li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0F1520] rounded-2xl border border-[#1E2A3F] p-8">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center"><svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Decryption Complete!</h3>
                      <p className="text-gray-400 text-sm mt-1">Your file has been successfully decrypted</p>
                    </div>
                  </div>
                  <div className="mt-8 space-y-3">
                    <button type="button" onClick={handleDownloadDecryptedFile} className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      <span>Download Original File</span>
                    </button>
                    <button type="button" onClick={resetState} className="w-full py-3 text-gray-500 hover:text-white transition-colors text-sm">Decrypt another file</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        <footer className="border-t border-white/5 bg-[#060912]">
          <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="space-y-8">
              <div className="flex justify-center">
                <div className="flex items-center gap-6 px-6 py-3 rounded-full bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    <span className="text-xs text-gray-400">AES-256</span>
                  </div>
                  <div className="w-px h-4 bg-white/10" />
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                    <span className="text-xs text-gray-400">100% Private</span>
                  </div>
                  <div className="w-px h-4 bg-white/10" />
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                    </svg>
                    <span className="text-xs text-gray-400">Client-Side</span>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-xs text-gray-600 uppercase tracking-widest">Development Team</p>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
                  {teamMembers.map((member, i) => (
                    <a
                      key={i}
                      href={member.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 text-gray-500 hover:text-white transition-all duration-300"
                    >
                      <span className="text-sm">{member.name}</span>
                      <div className="w-6 h-6 rounded-md bg-[#0A66C2]/20 flex items-center justify-center group-hover:bg-[#0A66C2] transition-all duration-300">
                        <LinkedInIcon />
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="text-center pt-6 border-t border-white/5">
                <p className="text-gray-600 text-xs">© 2025 FileVault. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}