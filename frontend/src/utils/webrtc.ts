/**
 * WebRTC utility functions and error handling
 */

// Check if the browser supports WebRTC
export const checkWebRTCSupport = (): {
  supported: boolean;
  error?: string;
} => {
  // Check for required browser features
  const missingFeatures = [];

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    missingFeatures.push("MediaDevices API");
  }

  if (typeof RTCPeerConnection === "undefined") {
    missingFeatures.push("RTCPeerConnection");
  }

  if (missingFeatures.length > 0) {
    return {
      supported: false,
      error: `Your browser doesn't support required WebRTC features: ${missingFeatures.join(
        ", "
      )}`,
    };
  }

  return { supported: true };
};

// Helper to get optimal video constraints based on device capabilities
export const getVideoConstraints = async (
  preferredQuality: "low" | "medium" | "high" = "medium"
): Promise<MediaTrackConstraints> => {
  // Define video quality presets
  const qualityPresets = {
    low: { width: { ideal: 320 }, height: { ideal: 240 } },
    medium: { width: { ideal: 640 }, height: { ideal: 480 } },
    high: { width: { ideal: 1280 }, height: { ideal: 720 } },
  };

  try {
    // Get list of video devices
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(
      (device) => device.kind === "videoinput"
    );

    // Use the default camera with preferred quality
    return {
      ...qualityPresets[preferredQuality],
      facingMode: "user",
      deviceId:
        videoDevices.length > 0
          ? { ideal: videoDevices[0].deviceId }
          : undefined,
    };
  } catch (error) {
    console.error("Error getting video constraints:", error);

    // Fall back to basic constraints if there's an error
    return qualityPresets[preferredQuality];
  }
};

// Parse user-friendly error messages from getUserMedia errors
export const getMediaErrorMessage = (error: any): string => {
  // Handle specific error types
  if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
    return "No camera or microphone found. Please connect a device and try again.";
  }

  if (
    error.name === "NotAllowedError" ||
    error.name === "PermissionDeniedError"
  ) {
    return "Camera or microphone access denied. Please allow access in your browser settings.";
  }

  if (error.name === "NotReadableError" || error.name === "TrackStartError") {
    return "Your camera or microphone is already in use by another application.";
  }

  if (error.name === "OverconstrainedError") {
    return "The requested camera settings are not supported by your device.";
  }

  // Generic error fallback
  return `Media error: ${error.message || error.name || "Unknown error"}`;
};
