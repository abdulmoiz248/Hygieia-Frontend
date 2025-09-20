"use client";
import { useRouter } from "next/navigation";

export default function ViewReport() {
  const router = useRouter();
  const params = new URLSearchParams(window.location.search);
  const fileUrl = params.get("fileUrl");
  const patientName = params.get("patientName");

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
