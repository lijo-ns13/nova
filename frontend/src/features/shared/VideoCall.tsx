import { useVideoCall } from "./useVideoCall";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhone,
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
    participants,
  } = useVideoCall(roomId, userId);

  const handleEndCall = () => {
    endCall();
    if (onEndCall) onEndCall();
  };

  // Get remote participant (excluding self)
  const remoteParticipant = participants.find((p) => p.userId !== userId);
  console.log("remoteParticipant*********************", remoteParticipant);
  return (
    <div className="video-call-container relative w-full h-full">
      {/* Remote Video */}
      <div className="remote-video w-full h-full bg-black relative">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {remoteParticipant?.video === false && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-75">
            <p className="text-white text-xl">Remote video is off</p>
          </div>
        )}

        {remoteParticipant && remoteParticipant.audio === false && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-black bg-opacity-50 text-white rounded">
            Remote is muted
          </div>
        )}
      </div>

      {/* Local Video */}
      <div className="local-video absolute bottom-4 right-4 w-1/4 h-1/4 rounded-lg overflow-hidden border-2 border-white shadow-lg relative">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        {isVideoOff && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
            <p className="text-white text-sm">Your video is off</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="controls absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 bg-black bg-opacity-50 rounded-full p-3">
        <button
          onClick={toggleAudio}
          className={`p-3 rounded-full ${
            isAudioMuted ? "bg-red-500" : "bg-gray-700"
          } text-white`}
          aria-label={isAudioMuted ? "Unmute microphone" : "Mute microphone"}
        >
          {isAudioMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>

        <button
          onClick={toggleVideo}
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
