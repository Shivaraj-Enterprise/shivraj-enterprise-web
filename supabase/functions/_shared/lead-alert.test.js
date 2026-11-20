import { expect, it } from "bun:test";
import { sendLeadAlert } from "./lead-alert.ts";

it("sends owner alerts immediately with the saved lead id as the duplicate guard", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.Deno = { env: { get: () => "test-key" } };
  let request;
  globalThis.fetch = async (_url, options) => { request = options; return new Response('{}', { status: 200 }); };
  try {
    expect((await sendLeadAlert({ id: "saved-profile-123", subject: "Profile request", html: "Details", replyTo: "test@example.com" })).status).toBe("accepted");
    expect(request.headers["Idempotency-Key"]).toBe("lead-alert-saved-profile-123");
    expect(JSON.parse(request.body).to).toEqual(["shivrajenterprise1234@gmail.com"]);
  } finally { globalThis.fetch = originalFetch; delete globalThis.Deno; }
});

it("does not report acceptance when the email provider rejects a saved lead alert", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.Deno = { env: { get: () => "test-key" } };
  globalThis.fetch = async () => new Response('quota exceeded', { status: 429 });
  try { expect((await sendLeadAlert({ id: "saved-quote-123", subject: "Quote", html: "Details", replyTo: "test@example.com" })).status).toBe("failed"); }
  finally { globalThis.fetch = originalFetch; delete globalThis.Deno; }
});