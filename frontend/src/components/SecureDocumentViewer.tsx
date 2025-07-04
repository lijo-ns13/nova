import React, { useEffect, useState } from "react";
import Button from "./ui/Button";
import { mediaService } from "../services/s3service";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Props {
  mediaId: string; // backend will proxy this
  fileName?: string; // optional download filename
  mimeType?: string; // optional expected type
}

const SecureDocumentViewer: React.FC<Props> = ({
  mediaId,
  fileName = "document.pdf",
  mimeType: initialMimeType,
}) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(
    initialMimeType || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    const fetchDocument = async () => {
      try {
        const response = await mediaService.streamMediaById(mediaId);

        const contentType = response.headers.get("Content-Type");

        if (!response.ok || contentType?.includes("application/json")) {
          throw new Error("Invalid or expired link.");
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
        setMimeType(blob.type || contentType || null);
      } catch (err: any) {
        console.error("Error loading document:", err);
        setError(err.message || "Failed to load file.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [mediaId]);

  const handleDownload = () => {
    if (!blobUrl) return;

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // === UI ===
  if (loading) {
    return <div className="bg-gray-100 animate-pulse h-40 w-full rounded" />;
  }

  if (error || !blobUrl || !mimeType) {
    return (
      <div className="text-red-500 text-sm">
        Error: {error || "Unable to load document."}
      </div>
    );
  }

  const isPDF = mimeType === "application/pdf";

  return (
    <div className="space-y-4">
      {isPDF ? (
        <iframe
          src={blobUrl}
          title="Secure PDF Preview"
          className="w-full h-[600px] rounded border shadow"
        />
      ) : (
        <p className="text-sm text-yellow-600">
          Cannot preview this file type: <code>{mimeType}</code>
        </p>
      )}

      <Button variant="outline" onClick={handleDownload}>
        Download
      </Button>
    </div>
  );
};

export default SecureDocumentViewer;
