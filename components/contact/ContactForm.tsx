"use client";

import { Suspense, startTransition, useActionState, useEffect, useRef, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { sendContact } from "@/app/(site)/contato/actions";
import { ExternalLink } from "@/components/layout/ExternalLink";
import { primaryButtonClass } from "@/components/project/styles";
import type { ContactContent } from "@/lib/content/contact";
import { cn } from "@/lib/utils";
import {
  CONTACT_LIMITS,
  CONTACT_TIME_TRAP,
  defaultContactSubject,
  initialContactState,
  isContactSubject,
  type ContactField,
  type ContactSubject,
} from "@/lib/validation/contact";

type ContactFormProps = {
  subjects: ContactContent["subjects"];
  messages: ContactContent["messages"];
  email: string;
  linkedin: string;
};

const labelClass = "text-small font-medium text-foreground";
// Border uses the `subtle` token: 4.60:1 against the card (surface) and 4.25:1 against
// the field (surface-2), above the 3:1 WCAG 1.4.11 asks for control boundaries.
const controlClass =
  "w-full rounded-md border border-subtle bg-surface-2 px-3 text-body text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent aria-[invalid=true]:border-danger";
const errorClass = "text-small text-danger";

type SubjectSelectProps = { subjects: ContactFormProps["subjects"]; defaultValue: ContactSubject };

function SubjectSelect({ subjects, defaultValue }: SubjectSelectProps) {
  return (
    <select
      id="contact-subject"
      name="subject"
      defaultValue={defaultValue}
      className={cn(controlClass, "h-11")}
    >
      {subjects.map((subject) => (
        <option key={subject.value} value={subject.value}>
          {subject.label}
        </option>
      ))}
    </select>
  );
}

/** Reads `?assunto=` on the client; the static HTML ships the Suspense fallback (default subject). */
function SubjectSelectFromQuery({ subjects }: Pick<SubjectSelectProps, "subjects">) {
  const requested = useSearchParams().get("assunto");
  return (
    <SubjectSelect
      subjects={subjects}
      defaultValue={isContactSubject(requested) ? requested : defaultContactSubject}
    />
  );
}

export function ContactForm({ subjects, messages, email, linkedin }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(sendContact, initialContactState);
  const formRef = useRef<HTMLFormElement>(null);
  const mountedAt = useRef(0);

  // A new key after each success remounts the fields, clearing them.
  const formKey = state.status === "success" ? state.id : "contact-form";
  const fieldErrors: Partial<Record<ContactField, string>> =
    state.status === "invalid" ? state.fieldErrors : {};

  useEffect(() => {
    mountedAt.current = Date.now();
  }, [formKey]);

  useEffect(() => {
    // Expired time trap: restart the clock (already past the minimum, the visitor has been
    // here for hours) so the kept text can be resent right away.
    if (state.status === "expired") mountedAt.current = Date.now() - CONTACT_TIME_TRAP.minMs;
  }, [state]);

  useEffect(() => {
    if (state.status !== "invalid") return;
    const firstInvalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    firstInvalid?.focus();
  }, [state]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) return;
    const formData = new FormData(event.currentTarget);
    formData.set("elapsedMs", String(Date.now() - mountedAt.current));
    // Submitting outside the `action` prop avoids React's automatic form reset,
    // so typed values survive validation and delivery errors.
    startTransition(() => formAction(formData));
  }

  const errorProps = (field: ContactField) =>
    fieldErrors[field]
      ? { "aria-invalid": true as const, "aria-describedby": `contact-${field}-error` }
      : { "aria-invalid": false as const };

  const statusMessage = {
    idle: null,
    success: messages.success,
    invalid: messages.invalid,
    expired: messages.expired,
    unavailable: messages.unavailable,
    rate_limited: messages.rateLimited,
    error: messages.error,
  }[state.status];
  const isSuccess = state.status === "success";
  const showAlternatives =
    state.status === "unavailable" || state.status === "error" || state.status === "rate_limited";

  return (
    <div>
      <form
        key={formKey}
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        aria-describedby="contact-required-note"
      >
        <p id="contact-required-note" className="text-small text-muted-foreground">
          Campos marcados com * são obrigatórios.
        </p>

        <div className="mt-6 grid gap-5">
          <div className="grid gap-2">
            <label htmlFor="contact-name" className={labelClass}>
              Nome *
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength={CONTACT_LIMITS.name.max}
              className={cn(controlClass, "h-11")}
              {...errorProps("name")}
            />
            {fieldErrors.name ? (
              <p id="contact-name-error" className={errorClass}>
                {fieldErrors.name}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <label htmlFor="contact-email" className={labelClass}>
              E-mail *
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              maxLength={CONTACT_LIMITS.email.max}
              className={cn(controlClass, "h-11")}
              {...errorProps("email")}
            />
            {fieldErrors.email ? (
              <p id="contact-email-error" className={errorClass}>
                {fieldErrors.email}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <label htmlFor="contact-subject" className={labelClass}>
              Assunto
            </label>
            <Suspense fallback={<SubjectSelect subjects={subjects} defaultValue={defaultContactSubject} />}>
              <SubjectSelectFromQuery subjects={subjects} />
            </Suspense>
          </div>

          <div className="grid gap-2">
            <label htmlFor="contact-message" className={labelClass}>
              Mensagem *
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={6}
              required
              minLength={CONTACT_LIMITS.message.min}
              maxLength={CONTACT_LIMITS.message.max}
              className={cn(controlClass, "min-h-36 py-2")}
              {...errorProps("message")}
              aria-describedby={["contact-message-hint", fieldErrors.message ? "contact-message-error" : null]
                .filter(Boolean)
                .join(" ")}
            />
            <p id="contact-message-hint" className="text-small text-muted-foreground">
              Entre {CONTACT_LIMITS.message.min} e {CONTACT_LIMITS.message.max.toLocaleString("pt-BR")}{" "}
              caracteres.
            </p>
            {fieldErrors.message ? (
              <p id="contact-message-error" className={errorClass}>
                {fieldErrors.message}
              </p>
            ) : null}
          </div>

          {/* Honeypot: hidden from people and assistive tech; bots tend to fill every field. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="contact-website">Não preencha este campo</label>
            <input
              id="contact-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          aria-disabled={isPending}
          className={cn(
            primaryButtonClass,
            "mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto",
          )}
        >
          {isPending ? "Enviando…" : "Enviar mensagem"}
        </button>
      </form>

      {/* Outside the keyed form so the live region persists across remounts and is announced. */}

      <div role="status" aria-live="polite" className="mt-6 empty:hidden">
        {statusMessage ? (
          <div
            className={cn(
              "flex gap-3 rounded-md border p-4 text-small",
              isSuccess ? "border-success/40 text-foreground" : "border-danger/40 text-foreground",
            )}
          >
            {isSuccess ? (
              <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-success" />
            ) : (
              <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-danger" />
            )}
            <div>
              <p>{statusMessage}</p>
              {showAlternatives ? (
                <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  <a
                    href={`mailto:${email}`}
                    className="font-mono break-all text-accent underline-offset-4 hover:underline"
                  >
                    {email}
                  </a>
                  <ExternalLink href={linkedin} className="text-accent underline-offset-4 hover:underline">
                    LinkedIn
                  </ExternalLink>
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
