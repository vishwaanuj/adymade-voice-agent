import React, { useState, useCallback } from 'react';
import { Role } from 'ultravox-client';
import { toggleMute } from '@/lib/callFunctions';
import { MicIcon, MicOffIcon, Volume2Icon, VolumeOffIcon } from 'lucide-react';

interface MicToggleButtonProps {
  role: Role;
}

const MicToggleButton: React.FC<MicToggleButtonProps> = ({ role }) => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMic = useCallback(async () => {
    try {
      toggleMute(role);
      setIsMuted(!isMuted);
    } catch (error) {
      console.error("Error toggling microphone:", error);
    }
  }, [isMuted, role]);

  const isUserMic = role === Role.USER;
  const buttonText = isMuted ? 'Unmute' : 'Mute';
  const IconComponent = isMuted 
    ? (isUserMic ? MicOffIcon : VolumeOffIcon)
    : (isUserMic ? MicIcon : Volume2Icon);

  return (
    <button
      onClick={toggleMic}
      className={`flex-grow flex items-center justify-center h-12 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg border ${
        isMuted
          ? 'bg-gray-600 hover:bg-gray-700 border-gray-500 text-gray-200'
          : isUserMic 
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-purple-500 text-white'
            : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-blue-500 text-white'
      }`}
    >
      <IconComponent width={20} height={20} className="mr-2" />
      <span>{buttonText} {isUserMic ? 'Mic' : 'Speaker'}</span>
    </button>
  );
};

export default MicToggleButton;