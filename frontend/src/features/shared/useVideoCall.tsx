import { useEffect, useRef, useState, useCallback } from "react";
import Peer, { MediaConnection } from "peerjs";

import socket, {
  connectSocket,
  joinVideoRoom,
  leaveVideoRoom,
} from "../../socket/socket";

interface Participant {
  userId: string;
  audio: boolean;
  video: boolean;
}

export function useVideoCall(roomId: string, userId: string) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const peerRef = useRef<Peer | null>(null);
  const stringUserId = userId.toString();
  const ongoingCalls = useRef<Map<string, MediaConnection>>(new Map());

  const toggleAudio = useCallback(() => {
    setIsAudioMuted((prevMuted) => {
      const newMuted = !prevMuted;
      const newEnabled = !newMuted;

      if (localStream) {
        localStream.getAudioTracks().forEach((track) => {
          track.enabled = newEnabled;
          replaceTrack("audio", track); // ✅ Replace remote
        });
      }

      socket.emit("audio-toggle", { roomId, userId, enabled: newEnabled });
      return newMuted;
    });
  }, [localStream, roomId, userId]);
  const toggleVideo = useCallback(() => {
    setIsVideoOff((prevOff) => {
      const newOff = !prevOff;
      const newEnabled = !newOff;

      if (localStream) {
        localStream.getVideoTracks().forEach((track) => {
          track.enabled = newEnabled;
          replaceTrack("video", track); // ✅ Replace remote
        });
      }

      socket.emit("video-toggle", { roomId, userId, enabled: newEnabled });
      return newOff;
    });
  }, [localStream, roomId, userId]);

  const endCall = useCallback(() => {
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    leaveVideoRoom(roomId, stringUserId);
  }, [localStream, roomId, stringUserId]);
  const replaceTrack = (
    kind: "audio" | "video",
    newTrack: MediaStreamTrack
  ) => {
    ongoingCalls.current.forEach((call) => {
      const sender = call.peerConnection
        .getSenders()
        .find((s) => s.track?.kind === kind);
      if (sender) {
        sender.replaceTrack(newTrack);
      }
    });
  };

  useEffect(() => {
    let peerInstance: Peer;
    let stream: MediaStream;

    connectSocket();
    joinVideoRoom(roomId, stringUserId);

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
        stream = mediaStream;
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        // peerInstance = new Peer(stringUserId, {
        //   host: "api.lijons.shop", // ✅ your backend domain
        //   port: 443, // ✅ HTTPS default port
        //   path: "/peerjs", // ✅ must match the reverse proxy path
        //   secure: true, // ✅ enables wss://
        //   debug: 3,
        // });
        peerInstance = new Peer(stringUserId, {
          host: window.location.hostname,
          port: 5000,
          path: "/peerjs",
          secure: false,
          debug: 3,
        });

        peerRef.current = peerInstance;
        setPeer(peerInstance);

        peerInstance.on("open", (id) => {
          console.log("PeerJS ready with ID:", id);
        });

        peerInstance.on("call", (call) => {
          call.answer(stream);
          ongoingCalls.current.set(call.peer, call); // Save the call for future use
          call.on("stream", (remoteStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });
        });

        peerInstance.on("error", (err) => {
          console.error("PeerJS error:", err);
        });

        socket.on("user-connected", (remoteId) => {
          if (!peerInstance || !stream || peerInstance.disconnected) return;
          const call = peerInstance.call(remoteId, stream);
          ongoingCalls.current.set(remoteId, call); // Save the call
          call.on("stream", (remoteStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });
        });
      })
      .catch(console.error);

    // Handle participant list on join
    socket.on("video-room-participants", (initialParticipants) => {
      setParticipants(initialParticipants);
    });

    // Handle remote user toggle updates
    socket.on("audio-toggle", ({ userId, enabled }) => {
      setParticipants((prev) =>
        prev.map((p) => (p.userId === userId ? { ...p, audio: enabled } : p))
      );
    });

    socket.on("video-toggle", ({ userId, enabled }) => {
      setParticipants((prev) =>
        prev.map((p) => (p.userId === userId ? { ...p, video: enabled } : p))
      );
    });

    socket.on("user-disconnected", (remoteId) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      setParticipants((prev) => prev.filter((p) => p.userId !== remoteId));
    });

    return () => {
      if (peerInstance && !peerInstance.destroyed) {
        peerInstance.destroy();
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      leaveVideoRoom(roomId, stringUserId);
      socket.off("user-connected");
      socket.off("user-disconnected");
      socket.off("video-room-participants");
      socket.off("audio-toggle");
      socket.off("video-toggle");
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
    participants, // ✅ newly added
  };
}
