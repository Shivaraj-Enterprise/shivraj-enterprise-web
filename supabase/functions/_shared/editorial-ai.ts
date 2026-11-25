import type {} from "./generated/ai-gateway/models.d.ts";
import { generateChatCompletion, GatewayError } from "npm:@lovable.dev/ai-gateway@0.1.13";

export class GatewayStop extends Error {
  constructor(public status: number, message: string) { super(message); }
}

/** Preserve the existing writing model; the SDK handles safe transport retries. */
export async function editorialJson(system: string, user: string): Promise<unknown> {
  try {
    const response = await generateChatCompletion({
      model: "google/gemini-3-flash-preview",
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
      response_format: { type: "json_object" },
    });
    const message = response.choices[0]?.message;
    if (message?.refusal) throw new Error("The article writer declined this request");
    if (typeof message?.content !== "string") throw new Error("AI returned no text");
    return JSON.parse(message.content);
  } catch (error) {
    if (error instanceof GatewayError && [402, 403, 429].includes(error.httpStatus ?? 0)) {
      throw new GatewayStop(error.httpStatus ?? 500, error.message);
    }
    throw error;
  }
}