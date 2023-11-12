export class InvalidWebhookException extends Error {
    name = 'Invalid variable "webhook_url". Please set it.';
    message = 'Webhook';
}