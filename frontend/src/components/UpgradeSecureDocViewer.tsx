import React, { useMemo } from "react";
import { Download, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";

interface SecureDocViewerProps {
  url: string; // full S3 signed URL
}

const isImage = (url: string) =>
  /\.(jpeg|jpg|png|webp|gif|bmp)$/i.test(url.split("?")[0]);

const isPDF = (url: string) => /\.pdf$/i.test(url.split("?")[0]);

const UpgradedSecureDocViewer: React.FC<SecureDocViewerProps> = ({ url }) => {
  const [zoom, setZoom] = useState(1);

  const zoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));

  const fileType = useMemo(() => {
    if (isImage(url)) return "image";
    if (isPDF(url)) return "pdf";
    return "other";
  }, [url]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "document"; // hint only
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-4">
      {/* Viewer Area */}
      <div className="relative border rounded overflow-hidden w-full min-h-[400px] max-h-[80vh] bg-gray-50 flex justify-center items-center">
        {fileType === "image" && (
          <img
            src={url}
            alt="Document"
            style={{ transform: `scale(${zoom})` }}
            className="transition-transform duration-300"
          />
        )}

        {fileType === "pdf" && (
          <iframe
            src={url}
            title="PDF Document"
            className="w-full h-[600px]"
            loading="lazy"
          />
        )}

        {fileType === "other" && (
          <p className="text-center text-gray-600 text-sm p-4">
            Cannot preview this file type. Please download to view.
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center gap-2">
        <div className="flex gap-2">
          {fileType === "image" && (
            <>
              <button
                onClick={zoomOut}
                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
              >
                <ZoomOut size={16} />
              </button>
              <button
                onClick={zoomIn}
                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
              >
                <ZoomIn size={16} />
              </button>
            </>
          )}
        </div>

        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center"
        >
          <Download size={16} className="mr-2" />
          Download
        </button>
      </div>
    </div>
  );
};

export default UpgradedSecureDocViewer;
