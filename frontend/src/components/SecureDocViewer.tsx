import React from "react";
import { Download } from "lucide-react";

interface SecureDocViewerProps {
  resumeUrl: string; // Full signed S3 URL (e.g., https://bucket.s3...&Signature=...)
}

const SecureDocViewer: React.FC<SecureDocViewerProps> = ({ resumeUrl }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = resumeUrl;
    link.download = "resume.pdf"; // S3 may override this, but it's a hint
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-4">
      {/* PDF Viewer */}
      <div className="w-full h-[600px] border rounded overflow-hidden">
        <iframe
          src={resumeUrl}
          title="Resume PDF"
          className="w-full h-full"
          loading="lazy"
        />
      </div>

      {/* Download Button */}
      {/* <button
        onClick={handleDownload}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center justify-center"
      >
        <Download size={16} className="mr-2" />
        Download Resume
      </button> */}
    </div>
  );
};

export default SecureDocViewer;
