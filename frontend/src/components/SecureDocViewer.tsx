import React, { useState } from "react";
import { Eye, Download } from "lucide-react";

interface SecureDocumentViewerProps {
  resumeUrl: string; // Pre-signed secure PDF URL (e.g., Cloudinary/S3)
}

const SecureDocViewer: React.FC<SecureDocumentViewerProps> = ({
  resumeUrl,
}) => {
  const [loading, setLoading] = useState(false);
  const [showViewer, setShowViewer] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const response = await fetch(resumeUrl, {
        method: "GET",
        credentials: "include",
      });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Toggle PDF Viewer */}
      <button
        onClick={() => setShowViewer((prev) => !prev)}
        className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center justify-center text-sm font-medium"
      >
        <Eye size={16} className="mr-2" />
        {showViewer ? "Hide Resume" : "View Resume"}
      </button>

      {/* PDF Viewer Inline (iframe) */}
      {showViewer && (
        <div className="w-full h-[500px] border rounded overflow-hidden">
          <iframe
            src={resumeUrl}
            title="Resume PDF"
            className="w-full h-full"
          />
        </div>
      )}

      {/* Download PDF Button */}
      <button
        onClick={handleDownload}
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center justify-center"
      >
        <Download size={16} className="mr-2" />
        {loading ? "Downloading..." : "Download Resume"}
      </button>
    </div>
  );
};

export default SecureDocViewer;
