import { useState, type FormEvent } from 'react';

interface Props {
  email: string;
  endpoint: string;
  submitLabel: string;
}

interface Fields {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  website: string;
}

type Errors = Partial<Record<keyof Fields, string>>;

const empty: Fields = {
  name: '',
  email: '',
  phone: '',
  company: '',
  message: '',
  website: '',
};

function validate(fields: Fields): Errors {
  const errors: Errors = {};
  if (fields.name.trim().length < 2) errors.name = 'Escribe tu nombre.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = 'Escribe un correo válido.';
  }
  const digits = fields.phone.replace(/\D/g, '');
  if (digits.length < 8) errors.phone = 'Escribe un WhatsApp válido.';
  return errors;
}

export default function ContactForm({ email, endpoint, submitLabel }: Props) {
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'mail' | 'api'>('idle');

  function update(key: keyof Fields, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(fields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (fields.website.trim()) {
      setStatus('api');
      return;
    }

    const payload = {
      name: fields.name.trim(),
      email: fields.email.trim(),
      phone: fields.phone.trim(),
      company: fields.company.trim(),
      message: fields.message.trim(),
    };

    if (endpoint) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('request failed');
        setStatus('api');
        return;
      } catch {
        /* Si el endpoint no responde, el correo sigue siendo la vía de contacto. */
      }
    }

    const subject = encodeURIComponent(`Auditoría inicial — ${payload.company || payload.name}`);
    const body = encodeURIComponent(
      `Nombre: ${payload.name}\nCorreo: ${payload.email}\nWhatsApp: ${payload.phone}\nEmpresa: ${payload.company || '—'}\n\n${payload.message || 'Quiero agendar la auditoría inicial.'}`,
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setStatus('mail');
  }

  if (status === 'api' || status === 'mail') {
    return (
      <div className="rounded-3xl bg-white p-8 text-ink shadow-[0_18px_40px_-28px_rgba(24,52,79,0.45)] ring-1 ring-accent/70" role="status">
        <p className="text-lg font-semibold">
          {status === 'api' ? 'Recibimos tu solicitud.' : 'Tu correo está listo para enviar.'}
        </p>
        <p className="mt-3 leading-relaxed text-muted">
          {status === 'api'
            ? 'Revisaremos tu caso y te contactaremos para la auditoría inicial.'
            : `Se abrió tu aplicación de correo con el mensaje dirigido a ${email}. Envíalo para agendar la auditoría.`}
        </p>
        <button
          type="button"
          className="mt-6 text-sm font-semibold text-brand hover:text-brand-deep"
          onClick={() => {
            setFields(empty);
            setErrors({});
            setStatus('idle');
          }}
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <form
      className="relative rounded-3xl bg-white p-6 text-ink shadow-[0_18px_40px_-28px_rgba(24,52,79,0.45)] ring-1 ring-accent/70 sm:p-8"
      onSubmit={onSubmit}
      noValidate
      action={`mailto:${email}`}
      method="post"
      encType="text/plain"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="nombre"
          label="Nombre"
          autoComplete="name"
          value={fields.name}
          error={errors.name}
          onChange={(value) => update('name', value)}
        />
        <Field
          id="correo"
          label="Correo"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={fields.email}
          error={errors.email}
          onChange={(value) => update('email', value)}
        />
        <Field
          id="whatsapp"
          label="WhatsApp"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          value={fields.phone}
          error={errors.phone}
          onChange={(value) => update('phone', value)}
        />
        <Field
          id="empresa"
          label="Empresa"
          autoComplete="organization"
          value={fields.company}
          optional
          onChange={(value) => update('company', value)}
        />
      </div>

      <label className="mt-4 block text-sm font-medium" htmlFor="mensaje">
        Qué quieres lograr <span className="font-normal text-muted">(opcional)</span>
      </label>
      <textarea
        id="mensaje"
        name="message"
        rows={4}
        value={fields.message}
        onChange={(event) => update('message', event.target.value)}
        className="mt-2 w-full resize-y rounded-2xl border border-line bg-ice px-4 py-3 text-sm outline-none ring-accent focus:border-accent focus:ring-2"
      />

      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Sitio web</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={fields.website}
          onChange={(event) => update('website', event.target.value)}
        />
      </div>

      <button
        type="submit"
        className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-white ring-1 ring-accent transition-colors hover:bg-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {submitLabel}
      </button>
      <p className="mt-3 text-center text-xs leading-relaxed text-muted">
        Usamos tus datos solo para contactarte sobre la auditoría inicial.
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  autoComplete,
  inputMode,
  optional = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel';
  optional?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium" htmlFor={id}>
        {label} {optional && <span className="font-normal text-muted">(opcional)</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-2xl border border-line bg-ice px-4 text-sm outline-none ring-accent focus:border-accent focus:ring-2"
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-brand-deep" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
