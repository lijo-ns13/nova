// hooks/useVideoCall.ts
import { useEffect, useRef, useState, useCallback } from "react";
import Peer from "peerjs";
import socket, {
  connectSocket,
  joinVideoRoom,
  leaveVideoRoom,
} from "../../socket/socket";

export function useVideoCall(roomId: string, userId: string) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const peerRef = useRef<Peer | null>(null);
  const stringUserId = userId.toString();

  const toggleAudio = useCallback(
    (enabled: boolean) => {
      if (localStream) {
        localStream.getAudioTracks().forEach((track) => {
          track.enabled = enabled;
        });
        setIsAudioMuted(!enabled);
        socket.emit("audio-toggle", { roomId, userId, enabled });
      }
    },
    [localStream, roomId, userId]
  );

  const toggleVideo = useCallback(
    (enabled: boolean) => {
      if (localStream) {
        localStream.getVideoTracks().forEach((track) => {
          track.enabled = enabled;
        });
        setIsVideoOff(!enabled);
        socket.emit("video-toggle", { roomId, userId, enabled });
      }
    },
    [localStream, roomId, userId]
  );

  const endCall = useCallback(() => {
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    leaveVideoRoom(roomId, stringUserId);
  }, [localStream, roomId, stringUserId]);

  useEffect(() => {
    let peerInstance: Peer;
    let stream: MediaStream;

    // 1. First connect to socket
    connectSocket();
    joinVideoRoom(roomId, stringUserId);

    // 2. Get user media
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
      .then((mediaStream) => {
        console.log("Audio tracks:", mediaStream.getAudioTracks());
        console.log("Video tracks:", mediaStream.getVideoTracks());
        stream = mediaStream;
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // 3. Initialize PeerJS after media is ready
        peerInstance = new Peer(stringUserId, {
          host: window.location.hostname,
          port: 5000,
          path: "/peerjs",
          debug: 3,
        });

        peerRef.current = peerInstance;
        setPeer(peerInstance);

        peerInstance.on("open", (id) => {
          console.log("PeerJS ready with ID:", id);
        });

        peerInstance.on("call", (call) => {
          console.log("Incoming call from:", call.peer);
          call.answer(stream);
          call.on("stream", (remoteStream) => {
            console.log("Received remote stream");
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });
        });

        peerInstance.on("error", (err) => {
          console.error("PeerJS error:", err);
        });

        socket.on("user-connected", (remoteId) => {
          console.log("User connected:", remoteId);
          if (!peerInstance || !stream || peerInstance.disconnected) return;

          const call = peerInstance.call(remoteId, stream);
          call.on("stream", (remoteStream) => {
            console.log("Received remote stream from call");
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });
        });
      })
      .catch(console.error);

    socket.on("user-disconnected", (remoteId) => {
      console.log("User disconnected:", remoteId);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    });

    return () => {
      console.log("Cleaning up video call");
      if (peerInstance && !peerInstance.destroyed) {
        peerInstance.destroy();
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      leaveVideoRoom(roomId, stringUserId);
      socket.off("user-connected");
      socket.off("user-disconnected");
    };
  }, [roomId, stringUserId]);

  return {
    localVideoRef,
    remoteVideoRef,
    toggleAudio,
    toggleVideo,
    endCall,
    isAudioMuted,
    isVideoOff,
  };
}
