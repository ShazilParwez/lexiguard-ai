import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function StatusBadge() {
  const [isAiConnected, setIsAiConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await api.checkHealth();
        setIsAiConnected(res.ai_connected);
      } catch (e) {
        setIsAiConnected(false);
      }
    };
    checkStatus();
  }, []);

  if (isAiConnected === null) return null;

  return (
    <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium border ${isAiConnected ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
      {isAiConnected ? (
        <><CheckCircle2 className="w-3 h-3 mr-1.5" /> AI Connected</>
      ) : (
        <><AlertCircle className="w-3 h-3 mr-1.5" /> Demo Mode</>
      )}
    </div>
  );
}
