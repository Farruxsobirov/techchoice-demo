'use client';

import { useEffect, useRef } from 'react';

/**
 * Contact Form 7 form (markup rendered by WordPress), shown in the site's design.
 * Submitting goes to /api/contact, which hands it to Contact Form 7 (validation, mail, spam checks).
 */
const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';

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

    // Contact Form 7's plain <input type="submit"> → the site's button (rolling label, arrow, magnetic pull, spinner while sending)
    const cleanups = [];
    const input = form.querySelector('input[type="submit"]');
    if (input) {
      const b = document.createElement('button');
      b.type = 'submit';
      b.className = 'btn ink ct-submit';
      b.setAttribute('data-ready', '');
      b.innerHTML = `<span class="roll"><span></span><span aria-hidden="true"></span></span><span class="ico">${ARROW}${ARROW}</span><span class="ct-spin" aria-hidden="true"></span>`;
      const label = input.value || 'Send message';
      b.querySelectorAll('.roll > span').forEach((sp) => (sp.textContent = label));
      input.replaceWith(b);
      const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (fine && !reduce) {
        let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0;
        const loop = () => {
          cx += (tx - cx) * 0.18;
          cy += (ty - cy) * 0.18;
          b.style.translate = `${cx.toFixed(2)}px ${cy.toFixed(2)}px`;
          raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.1 ? requestAnimationFrame(loop) : 0;
        };
        const move = (e) => {
          const r = b.getBoundingClientRect();
          tx = (e.clientX - r.left - r.width / 2) * 0.28;
          ty = (e.clientY - r.top - r.height / 2) * 0.28;
          if (!raf) raf = requestAnimationFrame(loop);
        };
        const leave = () => {
          tx = 0;
          ty = 0;
          if (!raf) raf = requestAnimationFrame(loop);
        };
        b.addEventListener('pointermove', move);
        b.addEventListener('pointerleave', leave);
        cleanups.push(() => cancelAnimationFrame(raf));
      }
    }

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
      if (btn) {
        btn.disabled = true;
        btn.classList.add('is-loading');
        btn.setAttribute('aria-busy', 'true');
      }
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
        if (btn) {
          btn.disabled = false;
          btn.classList.remove('is-loading');
          btn.removeAttribute('aria-busy');
        }
      }
    };

    form.addEventListener('submit', onSubmit);
    return () => {
      form.removeEventListener('submit', onSubmit);
      cleanups.forEach((fn) => fn());
    };
  }, [html]);

  return <div className="ct-form" ref={box} dangerouslySetInnerHTML={{ __html: html }} />;
}
