import { useVideoCall } from "./useVideoCall";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhone,
  FaTimes,
} from "react-icons/fa";

const VideoCall = ({
  roomId,
  userId,
  onEndCall,
}: {
  roomId: string;
  userId: string;
  onEndCall?: () => void;
}) => {
  const {
    localVideoRef,
    remoteVideoRef,
    toggleAudio,
    toggleVideo,
    endCall,
    isAudioMuted,
    isVideoOff,
  } = useVideoCall(roomId, userId);

  const handleEndCall = () => {
    endCall();
    if (onEndCall) onEndCall();
  };

  return (
    <div className="video-call-container relative w-full h-full">
      {/* Remote Video (main) */}
      <div className="remote-video w-full h-full bg-black">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        {isVideoOff && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800">
            <div className="text-white text-xl">Video is turned off</div>
          </div>
        )}
      </div>

      {/* Local Video (small overlay) */}
      <div className="local-video absolute bottom-4 right-4 w-1/4 h-1/4 rounded-lg overflow-hidden border-2 border-white shadow-lg">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        {isVideoOff && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800">
            <div className="text-white text-sm">Your video is off</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="controls absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 bg-black bg-opacity-50 rounded-full p-3">
        <button
          onClick={() => {
            console.log("Toggling audio", isAudioMuted);
            toggleAudio(!isAudioMuted);
          }}
          className={`p-3 rounded-full ${
            isAudioMuted ? "bg-red-500" : "bg-gray-700"
          } text-white`}
          aria-label={isAudioMuted ? "Unmute microphone" : "Mute microphone"}
        >
          {isAudioMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>

        <button
          onClick={() => toggleVideo(!isVideoOff)}
          className={`p-3 rounded-full ${
            isVideoOff ? "bg-red-500" : "bg-gray-700"
          } text-white`}
          aria-label={isVideoOff ? "Turn on video" : "Turn off video"}
        >
          {isVideoOff ? <FaVideoSlash /> : <FaVideo />}
        </button>

        <button
          onClick={handleEndCall}
          className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700"
          aria-label="End call"
        >
          <FaPhone />
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
