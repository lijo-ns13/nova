import { useVideoCall } from "./useVideoCall";

const VideoCall = ({ roomId, userId }: { roomId: string; userId: string }) => {
  const { localVideoRef, remoteVideoRef } = useVideoCall(roomId, userId);

  return (
    <div className="video-call-container">
      <div className="remote-video">
        <video ref={remoteVideoRef} autoPlay playsInline />
      </div>
      <div className="local-video">
        <video ref={localVideoRef} autoPlay playsInline muted />
      </div>
    </div>
  );
};
export default VideoCall;
