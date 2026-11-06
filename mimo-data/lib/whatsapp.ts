export function normalizeBrazilianWhatsApp(input?: string | null) {
  const digits = (input || '').replace(/\D/g, '');
  if (!digits) return '';
  if ((digits.length === 10 || digits.length === 11) && !digits.startsWith('55')) return `55${digits}`;
  return digits;
}

export function buildWhatsAppLink(phone?: string | null, message?: string) {
  const normalized = normalizeBrazilianWhatsApp(phone);
  if (normalized.length < 12) return null;
  const encodedMessage = encodeURIComponent(message || 'Olá! Gostaria de falar com vocês pelo WhatsApp.');
  return `https://wa.me/${normalized}?text=${encodedMessage}`;
}
