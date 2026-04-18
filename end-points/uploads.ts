import { getApiBaseUrl, getStoredToken } from "@/end-points/http";

export interface UploadResponse {
  url: string;
}

/**
 * POST a single file to the backend upload endpoint.
 *
 * We don't go through the generic `request()` helper here because it sets
 * `Content-Type: application/json` and swallows `FormData` boundary headers.
 * This dedicated call keeps multipart upload semantics intact.
 */
async function uploadFile(file: File): Promise<UploadResponse> {
  const form = new FormData();
  form.append("file", file);

  const headers = new Headers();
  const token = getStoredToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${getApiBaseUrl()}/upload`, {
    method: "POST",
    credentials: "include",
    headers,
    body: form,
  });

  if (!res.ok) {
    let message = "Upload failed";
    try {
      const body = await res.json();
      if (typeof body?.message === "string") message = body.message;
      else if (Array.isArray(body?.message)) message = body.message.join(", ");
    } catch {
      message = res.statusText || message;
    }
    throw new Error(message);
  }

  return (await res.json()) as UploadResponse;
}

export const uploads = {
  uploadFile,
};
