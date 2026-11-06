import { z } from 'zod';
import type { FormField } from './types';

const fieldSchema = z.object({
  key: z.string().regex(/^[a-z][a-z0-9_]{0,29}$/, 'Chave inválida'),
  label: z.string().trim().min(2).max(80),
  type: z.enum(['text', 'tel', 'select']),
  required: z.boolean(),
  options: z.array(z.string().trim().min(1).max(80)).max(25).optional(),
  placeholder: z.string().max(120).optional(),
});

export const newBusinessSchema = z.object({
  name: z.string().trim().min(2).max(120),
  whatsapp: z.string().trim().min(10).max(25).regex(/^[+\d\s()\-.]+$/, 'WhatsApp inválido'),
});

export const formSchema = z.object({
  business_id: z.string().uuid(),
  title: z.string().trim().min(3).max(120),
  brand_name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(3).max(500),
  theme: z.enum(['caramelo', 'verde', 'azul', 'rosa']),
  fields: z.array(fieldSchema).min(1).max(12),
}).superRefine((value, ctx) => {
  const keys = value.fields.map((field) => field.key);
  if (new Set(keys).size !== keys.length) {
    ctx.addIssue({ code: 'custom', message: 'Os campos devem ter chaves únicas', path: ['fields'] });
  }
  for (const [index, field] of value.fields.entries()) {
    if (field.type === 'select' && (!field.options || field.options.length < 1)) {
      ctx.addIssue({ code: 'custom', message: 'Seleção precisa de opções', path: ['fields', index, 'options'] });
    }
    if (field.type === 'select' && new Set(field.options).size !== field.options?.length) {
      ctx.addIssue({ code: 'custom', message: 'As opções devem ser diferentes', path: ['fields', index, 'options'] });
    }
  }
});

export const submissionSchema = z.object({
  form_id: z.string().uuid(),
  answers: z.record(z.string(), z.string().max(240)),
  privacy_accepted: z.literal(true),
  marketing_opt_in: z.boolean().default(false),
  website: z.string().max(200).default(''), // campo armadilha anti-bot
});

export function validateAnswers(fields: FormField[], answers: Record<string, string>): string | null {
  const allowed = new Set(fields.map((item) => item.key));
  if (Object.keys(answers).some((key) => !allowed.has(key))) return 'O formulário contém campos desconhecidos.';
  for (const field of fields) {
    const answer = (answers[field.key] ?? '').trim();
    if (field.required && !answer) return `Preencha o campo: ${field.label}.`;
    if (answer.length > 240) return `Resposta muito longa: ${field.label}.`;
    if (field.type === 'select' && answer && !field.options?.includes(answer)) {
      return `Opção inválida para: ${field.label}.`;
    }
    if (field.type === 'tel' && answer && !/^[+\d\s()\-.]{8,22}$/.test(answer)) {
      return `Telefone inválido: ${field.label}.`;
    }
  }
  return null;
}

export function slugify(input: string): string {
  return input.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 45) || 'formulario';
}

export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Ocorreu um erro inesperado.';
}
