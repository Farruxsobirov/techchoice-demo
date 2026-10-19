'use client';

import { useEffect, useRef } from 'react';

/**
 * Contact Form 7 form (markup rendered by WordPress), shown in the site's design.
 * Submitting goes to /api/contact, which hands it to Contact Form 7 (validation, mail, spam checks).
 */
export default function ContactForm({ html }) {
  const box = useRef(null);

  useEffect(() => {
    const root = box.current;
    const form = root && root.querySelector('form');
    if (!form) return undefined;
    const wrap = form.closest('.wpcf7') || root;
    wrap.classList.remove('no-js');
    wrap.classList.add('js');
    let out = form.querySelector('.wpcf7-response-output');
    if (!out) {
      out = document.createElement('div');
      out.className = 'wpcf7-response-output';
      form.appendChild(out);
    }
    out.setAttribute('role', 'status');
    out.setAttribute('aria-live', 'polite');

    const clear = () => {
      form.querySelectorAll('.wpcf7-not-valid-tip').forEach((t) => t.remove());
      form.querySelectorAll('.wpcf7-not-valid').forEach((el) => {
        el.classList.remove('wpcf7-not-valid');
        el.removeAttribute('aria-invalid');
      });
      form.classList.remove('invalid', 'sent', 'failed', 'spam');
      out.textContent = '';
    };

    const onSubmit = async (e) => {
      e.preventDefault();
      if (form.classList.contains('submitting')) return;
      clear();
      form.classList.add('submitting');
      const btn = form.querySelector('[type="submit"]');
      if (btn) btn.disabled = true;
      try {
        const res = await fetch('/api/contact', { method: 'POST', body: new FormData(form) });
        const data = await res.json().catch(() => ({}));
        if (data.status === 'mail_sent') {
          form.reset();
          form.classList.add('sent');
        } else if (data.status === 'validation_failed') {
          form.classList.add('invalid');
          (data.invalid_fields || []).forEach((f) => {
            const name = String(f.field || '');
            const field = form.querySelector(`[name="${CSS.escape(name)}"], [name="${CSS.escape(name)}[]"]`);
            const holder = (field && field.closest('.wpcf7-form-control-wrap')) || (field && field.parentElement);
            if (field) {
              field.classList.add('wpcf7-not-valid');
              field.setAttribute('aria-invalid', 'true');
            }
            if (holder) {
              const tip = document.createElement('span');
              tip.className = 'wpcf7-not-valid-tip';
              tip.textContent = f.message || '';
              holder.appendChild(tip);
            }
          });
          const first = form.querySelector('.wpcf7-not-valid');
          if (first) first.focus();
        } else {
          form.classList.add(data.status === 'spam' ? 'spam' : 'failed');
        }
        out.textContent = data.message || (res.ok ? '' : 'Something went wrong. Please email us directly.');
      } catch {
        form.classList.add('failed');
        out.textContent = 'Something went wrong. Please check your connection and try again, or email us directly.';
      } finally {
        form.classList.remove('submitting');
        if (btn) btn.disabled = false;
      }
    };

    form.addEventListener('submit', onSubmit);
    return () => form.removeEventListener('submit', onSubmit);
  }, [html]);

  return <div className="ct-form" ref={box} dangerouslySetInnerHTML={{ __html: html }} />;
}
