import React, { useState, useEffect, useMemo } from 'react';
import { PasswordRecord } from '../types';
import { generatePassword } from '../lib/generator';
import { encrypt, decrypt, hashKey } from '../lib/encryption';
import { 
  Search, Copy, LogOut, ShieldCheck, Trash2, Check, Eye, EyeOff
} from 'lucide-react';

interface DashboardProps {
  user: any; // Kept for prop compatibility, but unused
  masterKey: string;
  onLogout: () => void;
}

export function Dashboard({ masterKey, onLogout }: DashboardProps) {
  const [records, setRecords] = useState<PasswordRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  
  // UI State
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');

  // Create a unique storage key based on the master password
  const storageKey = useMemo(() => `passvault_${hashKey(masterKey)}`, [masterKey]);

  useEffect(() => {
    // Load from localStorage
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        // Try to decrypt the entire vault
        const decryptedData = decrypt(stored, masterKey);
        if (decryptedData) {
          const parsed = JSON.parse(decryptedData);
          // Sort by timestamp descending
          parsed.sort((a: PasswordRecord, b: PasswordRecord) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          setRecords(parsed);
        } else {
          // Fallback: Try parsing as plaintext (in case of old unencrypted vault format)
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              parsed.sort((a: PasswordRecord, b: PasswordRecord) => 
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
              );
              setRecords(parsed);
            }
          } catch (fallbackErr) {
            setError('Failed to decrypt your vault data. Incorrect master key or corrupted data.');
          }
        }
      } else {
        // No data found for this user, start fresh
        setRecords([]);
      }
    } catch (err) {
      console.error('Failed to load records from local storage', err);
      setError('Failed to load your vault data.');
    } finally {
      setIsLoading(false);
    }
  }, [storageKey, masterKey]);

  const saveToStorage = (newRecords: PasswordRecord[]) => {
    try {
      // Encrypt the entire array of records for maximum security
      const encryptedData = encrypt(JSON.stringify(newRecords), masterKey);
      localStorage.setItem(storageKey, encryptedData);
      setRecords(newRecords);
    } catch (err) {
      console.error('Failed to save to local storage', err);
      setError('Failed to save to your local vault.');
    }
  };

  const handleGenerate = () => {
    if (!username.trim()) {
      setError('Username is required to generate a password');
      return;
    }
    setError('');
    setGeneratedPassword(generatePassword(username));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!website.trim() || !username.trim() || !generatedPassword.trim()) {
      setError('All fields are required');
      return;
    }

    const isDuplicate = records.some(
      r => r.website.toLowerCase() === website.toLowerCase() && 
           r.username.toLowerCase() === username.toLowerCase()
    );

    if (isDuplicate) {
      setError('An entry for this website and username already exists');
      return;
    }

    const newId = crypto.randomUUID();
    const newRecord: PasswordRecord = {
      id: newId,
      website: website.trim(),
      username: username.trim(),
      encryptedPassword: encrypt(generatedPassword, masterKey),
      timestamp: new Date().toISOString(),
    };

    const updatedRecords = [newRecord, ...records];
    saveToStorage(updatedRecords);
    
    setWebsite('');
    setUsername('');
    setGeneratedPassword('');
    setError('');
  };

  const confirmDelete = async (id: string) => {
    const updatedRecords = records.filter(r => r.id !== id);
    saveToStorage(updatedRecords);
    setDeleteConfirmId(null);
  };

  const handleSignOut = async () => {
    onLogout();
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const togglePasswordVisibility = (id: string) => {
    const newSet = new Set(visiblePasswords);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setVisiblePasswords(newSet);
  };

  const filteredRecords = useMemo(() => {
    return records.filter(r => 
      r.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [records, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-gray-900 font-sans selection:bg-black selection:text-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-7 w-7 text-black" />
            <h1 className="text-2xl font-bold tracking-tight">PassVault.</h1>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Lock Vault
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Form */}
        <div className="lg:col-span-4 space-y-8">
          <div>
            <h2 className="text-3xl font-medium tracking-tight mb-2">New Entry</h2>
            <p className="text-gray-500 text-sm">Create a secure password for a new service.</p>
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-sm border border-red-100 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                Website / App
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                placeholder="e.g. github.com"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
                className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                placeholder="e.g. john_doe"
              />
              <p className="text-xs text-gray-400 mt-1">Press Enter to auto-generate password</p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleGenerate}
                className="flex-1 py-3 px-4 bg-white border border-gray-200 text-black rounded-xl text-sm font-semibold hover:border-black transition-colors"
              >
                Generate
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm"
              >
                Save Entry
              </button>
            </div>

            {generatedPassword && (
              <div className="mt-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Generated Password
                </label>
                <div className="flex items-center justify-between bg-[#F7F7F5] px-4 py-3 rounded-xl border border-gray-100">
                  <span className="font-mono text-lg text-black tracking-tight">
                    {generatedPassword}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(generatedPassword, 'generated')}
                    className="text-gray-400 hover:text-black transition-colors p-2 bg-white rounded-lg shadow-sm border border-gray-200"
                    title="Copy Password"
                  >
                    {copiedId === 'generated' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Right Column: List */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-medium tracking-tight mb-2">Vault</h2>
              <p className="text-gray-500 text-sm">Manage your stored credentials.</p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vault..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="text-center py-20 px-6">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-16 w-16 bg-gray-100 rounded-full mb-4"></div>
                  <div className="h-4 w-32 bg-gray-100 rounded mb-2"></div>
                  <div className="h-3 w-48 bg-gray-50 rounded"></div>
                </div>
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="text-center py-20 px-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                  <ShieldCheck className="h-8 w-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Vault is empty</h3>
                <p className="text-gray-500 text-sm">Generate and save your first password to see it here.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredRecords.map(record => {
                  const decrypted = decrypt(record.encryptedPassword, masterKey);
                  return (
                    <div 
                      key={record.id} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-gray-50 transition-colors gap-4 group"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate mb-1">
                          {record.website}
                        </h3>
                        <p className="text-sm text-gray-500 truncate font-mono">
                          {record.username}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="font-mono text-sm bg-[#F7F7F5] px-4 py-2 rounded-lg border border-gray-200 text-gray-600 truncate max-w-[120px] sm:max-w-[160px]">
                          {decrypted ? (visiblePasswords.has(record.id) ? decrypted : '••••••••') : 'Error'}
                        </div>
                        
                        <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => togglePasswordVisibility(record.id)}
                            className="p-2.5 text-gray-500 hover:text-black bg-white border border-gray-200 rounded-xl hover:border-black transition-all shadow-sm"
                            title={visiblePasswords.has(record.id) ? "Hide Password" : "Show Password"}
                          >
                            {visiblePasswords.has(record.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => handleCopy(decrypted, record.id)}
                            className="p-2.5 text-gray-500 hover:text-black bg-white border border-gray-200 rounded-xl hover:border-black transition-all shadow-sm"
                            title="Copy Password"
                          >
                            {copiedId === record.id ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                          
                          {deleteConfirmId === record.id ? (
                            <div className="flex items-center gap-1 bg-red-50 px-2 py-1.5 rounded-xl border border-red-100">
                              <span className="text-xs text-red-600 font-semibold mx-2">Sure?</span>
                              <button
                                onClick={() => confirmDelete(record.id)}
                                className="px-3 py-1 text-white bg-red-600 hover:bg-red-700 font-semibold text-xs rounded-lg shadow-sm transition-colors"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-3 py-1 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 font-semibold text-xs rounded-lg shadow-sm transition-colors"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(record.id)}
                              className="p-2.5 text-gray-400 hover:text-red-600 bg-white border border-gray-200 rounded-xl hover:border-red-200 hover:bg-red-50 transition-all shadow-sm"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
