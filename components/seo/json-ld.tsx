import React from "react";

export function JsonLd({ data }: { data: unknown | unknown[] }) {
  const payloads = Array.isArray(data) ? data : [data];

  return (
    <>
      {payloads.filter(Boolean).map((payload, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
        />
      ))}
    </>
  );
}
