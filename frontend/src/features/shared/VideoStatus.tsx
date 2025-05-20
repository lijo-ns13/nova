import React from "react";

interface VideoControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  isMuted,
  isVideoOff,
  onToggleMute,
  onToggleVideo,
  onEndCall,
}) => {
  return (
    <div className="flex justify-center mt-4 space-x-4">
      <button
        onClick={onToggleMute}
        className={`px-4 py-2 rounded-full transition-colors ${
          isMuted
            ? "bg-red-500 text-white"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? "Unmute" : "Mute"}
      </button>

      <button
        onClick={onToggleVideo}
        className={`px-4 py-2 rounded-full transition-colors ${
          isVideoOff
            ? "bg-red-500 text-white"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
        aria-label={isVideoOff ? "Turn Video On" : "Turn Video Off"}
      >
        {isVideoOff ? "Turn Video On" : "Turn Video Off"}
      </button>

      <button
        onClick={onEndCall}
        className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
        aria-label="End Call"
      >
        End Call
      </button>
    </div>
  );
};

export default VideoControls;
