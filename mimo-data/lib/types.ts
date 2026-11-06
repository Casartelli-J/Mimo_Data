export type FieldType = 'text' | 'tel' | 'select';
export type Theme = 'caramelo' | 'verde' | 'azul' | 'rosa';

export type FormField = {
  key: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
  placeholder?: string;
};

export type Business = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  whatsapp: string | null;
  created_at: string;
};

export type FormRecord = {
  id: string;
  business_id: string;
  slug: string;
  title: string;
  brand_name: string;
  description: string;
  theme: Theme;
  fields: FormField[];
  published: boolean;
  created_at: string;
};

export type Submission = {
  id: string;
  form_id: string;
  answers: Record<string, string>;
  privacy_accepted: boolean;
  marketing_opt_in: boolean;
  created_at: string;
};

export const cookieFields: FormField[] = [
  { key: 'nome', label: 'Nome', type: 'text', required: true, placeholder: 'Seu nome' },
  { key: 'sobrenome', label: 'Sobrenome', type: 'text', required: true, placeholder: 'Seu sobrenome' },
  { key: 'telefone', label: 'WhatsApp / telefone', type: 'tel', required: true, placeholder: '(51) 99999-9999' },
  { key: 'sabor', label: 'Qual sabor de cookie você prefere?', type: 'select', required: true, options: ['Chocolate', 'Red Velvet', 'Doce de leite', 'Baunilha'] },
];

export const themePalette: Record<Theme, {primary: string; background: string; light: string}> = {
  caramelo: { primary: '#643a27', background: '#fff7ed', light: '#f8e3c9' },
  verde: { primary: '#24684f', background: '#f1faf5', light: '#d6eee0' },
  azul: { primary: '#275c87', background: '#f2f8ff', light: '#d6e8fa' },
  rosa: { primary: '#a13e65', background: '#fff3f7', light: '#f9d9e6' },
};
