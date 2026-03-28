"use client";

import { useEffect, useState } from "react";

export default function ViewReport() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFileUrl(params.get("fileUrl"));
  }, []);

  if (!fileUrl) return <p>No report available.</p>;

  return (
    <div style={{ height: "100vh", margin: 0 }}>
      <iframe
        src={fileUrl}
        width="100%"
        height="100%"
        style={{ border: "none" }}
      />
    </div>
  );
}