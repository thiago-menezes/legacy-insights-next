import { z } from 'zod';

export const webhookFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.enum(['hotmart', 'kiwify', 'kirvano', 'custom_webhook']),
  webhookSecret: z.string().min(16, 'Secret deve ter ao menos 16 caracteres'),
  eventTypes: z
    .array(z.string())
    .min(1, 'Selecione ao menos um tipo de evento'),
  signatureValidation: z.boolean(),
  allowedOrigins: z.array(z.string()).optional(),
});

export type WebhookFormSchema = z.infer<typeof webhookFormSchema>;
