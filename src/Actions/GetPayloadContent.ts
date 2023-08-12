import { WebhookPayload } from "@actions/github/lib/interfaces";
import { warning } from "@actions/core/lib/core";

export const GetPayloadContent = (payload: WebhookPayload ): PayloadContent => {
    if (!payload?.release) {
        throw new Error(`Invalid payload release information.`);
    } 
    
    if (payload.release?.body.length >= 1500) {
        warning(`Payload message is longer than 1500 characters, so it will be parsed.`);
    }

    return {
        body: payload.release.body.length < 1500
            ? payload.release.body
            : payload.release.body.substring(0, 1500) + ` ([...])`,
        html_url: payload.release.html_url,
        name: payload.release.name,
    }
}