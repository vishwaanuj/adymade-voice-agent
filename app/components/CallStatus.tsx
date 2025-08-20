import React, { ReactNode, useState } from 'react';
import { Activity, Phone } from 'lucide-react';

interface CallStatusProps {
  status: string;
  children?: ReactNode;
}

const CallStatus: React.FC<CallStatusProps> = ({ status, children }) => {
  const getStatusColor = (status: string) => {
    if (status.includes('Call started') || status.includes('connected')) {
      return 'text-green-400';
    } else if (status.includes('Starting') || status.includes('Ending')) {
      return 'text-yellow-400';
    } else if (status.includes('Error') || status.includes('Failed')) {
      return 'text-red-400';
    } else {
      return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    if (status.includes('Call started') || status.includes('connected')) {
      return <Phone className="w-4 h-4 text-green-400" />;
    } else {
      return <Activity className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="flex flex-col bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 w-full lg:w-1/3">
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Call Status
          </h2>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-black/20 rounded-lg border border-white/5">
          {getStatusIcon(status)}
          <div>
            <p className="text-sm text-gray-400 font-medium">Status</p>
            <p className={`text-sm font-mono ${getStatusColor(status)}`}>
              {status}
            </p>
          </div>
        </div>
        
        {/* TODO: Add these back when needed */}
        {/* <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="p-3 bg-black/20 rounded-lg border border-white/5">
            <p className="text-xs text-gray-400 font-medium">Latency</p>
            <p className="text-sm font-mono text-gray-300">N/A</p>
          </div>
          <div className="p-3 bg-black/20 rounded-lg border border-white/5">
            <p className="text-xs text-gray-400 font-medium">Duration</p>
            <p className="text-sm font-mono text-gray-300">00:00</p>
          </div>
        </div> */}
      </div>

      {/* Optional Children */}
      {children}
    </div>
  );
};

export default CallStatus;