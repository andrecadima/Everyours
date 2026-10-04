"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { ChoiceGroup, Field, TextInput, inputClass } from "@/components/lead/form-controls";
import { SelectedLot } from "@/components/lead/selected-lot";
import { Turnstile } from "@/components/lead/turnstile";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { COUNTRY_CODES, countryOptions, type CountryCode } from "@/lib/countries";
import {
  BUDGET_RANGES,
  CONTACT_METHODS,
  LEAD_STEPS,
  leadFormSchema,
  type LeadFormInput,
  type LeadFormValues,
} from "@/lib/leads/schema";
import { submitLead } from "@/lib/leads/submit-lead";
import type { PropertySummary } from "@/lib/property-types";
import { cn } from "@/lib/utils";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function guessCountry(): CountryCode {
  try {
    const region = new Intl.Locale(navigator.language).maximize().region;
    if (region && (COUNTRY_CODES as readonly string[]).includes(region)) return region as CountryCode;
  } catch {
    // Fall through to the default.
  }
  return "US";
}

export function LeadForm({ property }: { property: PropertySummary }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>();
  const startedAt = useRef(0);
  const submissionKey = useRef("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const countries = useMemo(() => countryOptions(), []);

  const {
    register,
    control,
    handleSubmit,
    getValues,
    clearErrors,
    setFocus,
    setValue,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<LeadFormInput, unknown, LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "US",
      preferredContactMethod: undefined,
      monthlyBudgetRange: undefined,
      message: "",
      consent: false,
    },
  });

  useEffect(() => {
    startedAt.current = Date.now();
    submissionKey.current = crypto.randomUUID();
    setValue("country", guessCountry());
    track("lead_form_started", { propertyId: property.id });
  }, [property.id, setValue]);

  const goTo = (next: number) => {
    setStep(next);
    requestAnimationFrame(() => {
      headingRef.current?.focus();
      headingRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  };

  const submit = async (values: LeadFormValues) => {
    setServerError(null);
    const result = await submitLead({
      ...values,
      propertySlug: property.slug,
      submissionKey: submissionKey.current,
      website: (document.getElementById("eo-website") as HTMLInputElement | null)?.value ?? "",
      elapsedMs: Date.now() - startedAt.current,
      turnstileToken,
    });
    if (result.ok) {
      track("lead_submitted", { propertyId: property.id });
      router.push(`/properties/${property.slug}/apply/thanks`);
      return;
    }
    if (result.fieldErrors) {
      for (const [name, message] of Object.entries(result.fieldErrors)) {
        if (name in leadFormSchema.shape) setError(name as keyof LeadFormInput, { message });
      }
      const firstStep = LEAD_STEPS.findIndex((s) =>
        s.fields.some((f) => result.fieldErrors && f in result.fieldErrors),
      );
      if (firstStep >= 0 && firstStep !== step) goTo(firstStep);
    }
    setServerError(result.error);
  };

  /**
   * Validate only this step's fields against the shared schema. (Done by hand
   * rather than with trigger(): a blur from the field just typed in can race it
   * and drop the other fields' errors.)
   */
  const validateStep = (index: number) => {
    const fields = LEAD_STEPS[index].fields;
    const result = leadFormSchema.safeParse(getValues());
    const issues = result.success
      ? []
      : result.error.issues.filter((issue) => (fields as readonly string[]).includes(String(issue.path[0])));
    clearErrors([...fields]);
    const seen = new Set<string>();
    for (const issue of issues) {
      const name = String(issue.path[0]) as keyof LeadFormInput;
      if (seen.has(name)) continue;
      seen.add(name);
      setError(name, { type: "validate", message: issue.message });
    }
    const first = fields.find((f) => seen.has(f));
    if (first && first !== "preferredContactMethod" && first !== "monthlyBudgetRange") setFocus(first);
    return issues.length === 0;
  };

  const next = async (event: React.FormEvent) => {
    event.preventDefault();
    if (step < LEAD_STEPS.length - 1) {
      if (!validateStep(step)) return;
      track("lead_form_step_completed", { propertyId: property.id, step: step + 1 });
      goTo(step + 1);
      return;
    }
    await handleSubmit(submit)(event);
  };

  const current = LEAD_STEPS[step];
  const busy = isSubmitting || isSubmitSuccessful;
  const messageLength = useWatch({ control, name: "message" })?.length ?? 0;

  return (
    <form onSubmit={next} noValidate aria-describedby="form-progress" data-testid="lead-form">
      {/* Progress: three segments, the current step named. */}
      <div id="form-progress" className="mb-8">
        <p className="text-sm font-medium text-ink-2" data-testid="step-indicator">
          Step {step + 1} of {LEAD_STEPS.length}
        </p>
        <div className="mt-2 grid grid-cols-3 gap-1.5" aria-hidden="true">
          {LEAD_STEPS.map((s, i) => (
            <span
              key={s.id}
              className={cn("h-1 rounded-full transition-colors duration-300", i <= step ? "bg-monte" : "bg-ink/10")}
            />
          ))}
        </div>
      </div>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-[1.75rem] leading-tight font-semibold tracking-[-0.02em] focus:outline-none sm:text-[2rem]"
      >
        {step === 0 && "First, what’s your name?"}
        {step === 1 && "How can we reach you?"}
        {step === 2 && "Last step: your plan."}
      </h2>
      <p className="mt-2 text-ink-2">
        {step === 0 && "So we know who we’re talking to."}
        {step === 1 && "We’ll only use this to talk with you about this land."}
        {step === 2 && "Both questions are optional. They help us prepare for the call."}
      </p>

      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="eo-website">Website</label>
        <input id="eo-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="mt-7 space-y-5" key={current.id}>
        {step === 0 && (
          <div className="grid animate-rise gap-5 sm:grid-cols-2">
            <Field label="First name" error={errors.firstName?.message}>
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  autoComplete="given-name"
                  autoCapitalize="words"
                  enterKeyHint="next"
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                  {...register("firstName")}
                />
              )}
            </Field>
            <Field label="Last name" error={errors.lastName?.message}>
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  autoComplete="family-name"
                  autoCapitalize="words"
                  enterKeyHint="next"
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                  {...register("lastName")}
                />
              )}
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="animate-rise space-y-5">
            <Field label="Email" error={errors.email?.message}>
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  enterKeyHint="next"
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                  {...register("email")}
                />
              )}
            </Field>
            <div className="grid gap-5 sm:grid-cols-[1.4fr_1fr]">
              <Field
                label="Phone number"
                error={errors.phone?.message}
                hint="With country code if outside the U.S., e.g. +44 7700 900123"
              >
                {({ id, describedBy, invalid }) => (
                  <TextInput
                    id={id}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    enterKeyHint="next"
                    aria-invalid={invalid}
                    aria-describedby={describedBy}
                    {...register("phone")}
                  />
                )}
              </Field>
              <Field label="Country" error={errors.country?.message}>
                {({ id, describedBy, invalid }) => (
                  <select
                    id={id}
                    autoComplete="country"
                    aria-invalid={invalid}
                    aria-describedby={describedBy}
                    className={cn(inputClass, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22 stroke=%22%234d5550%22 stroke-width=%222%22 viewBox=%220 0 24 24%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:16px] bg-[right_0.875rem_center] bg-no-repeat pr-10")}
                    {...register("country")}
                  >
                    {countries.priority.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                    <option disabled>──────────</option>
                    {countries.rest.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
            </div>
            <Controller
              control={control}
              name="preferredContactMethod"
              render={({ field }) => (
                <ChoiceGroup
                  legend="Best way to contact you"
                  name={field.name}
                  options={CONTACT_METHODS}
                  value={field.value}
                  onChange={(v) => field.onChange(v)}
                  error={errors.preferredContactMethod?.message}
                />
              )}
            />
          </div>
        )}

        {step === 2 && (
          <div className="animate-rise space-y-6">
            <div className="lg:hidden">
              <SelectedLot property={property} compact />
            </div>
            <Controller
              control={control}
              name="monthlyBudgetRange"
              render={({ field }) => (
                <ChoiceGroup
                  legend="Comfortable monthly budget"
                  name={field.name}
                  options={BUDGET_RANGES}
                  value={field.value}
                  onChange={(v) => field.onChange(v)}
                  optional
                  columns={2}
                />
              )}
            />
            <Field
              label="Anything you’d like us to know?"
              optional
              error={errors.message?.message}
              hint={messageLength > 800 ? `${1000 - messageLength} characters left` : undefined}
            >
              {({ id, describedBy, invalid }) => (
                <textarea
                  id={id}
                  rows={4}
                  maxLength={1000}
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                  className={cn(inputClass, "h-auto min-h-28 resize-y py-3 leading-relaxed")}
                  {...register("message")}
                />
              )}
            </Field>

            <div>
              <label
                className={cn(
                  "flex cursor-pointer gap-3 rounded-sm border bg-surface p-4 text-[0.9375rem] leading-relaxed",
                  errors.consent ? "border-danger/70" : "border-line-strong/60",
                )}
              >
                <input
                  type="checkbox"
                  className="mt-0.5 size-5 shrink-0 accent-[var(--color-monte)]"
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={errors.consent ? "consent-error" : undefined}
                  {...register("consent")}
                />
                <span>
                  I agree that Everyours may contact me about this property and my inquiry. See our{" "}
                  <Link href="/privacy" target="_blank" className="font-medium underline underline-offset-2">
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/terms" target="_blank" className="font-medium underline underline-offset-2">
                    Terms
                  </Link>
                  .
                </span>
              </label>
              {errors.consent && (
                <p id="consent-error" className="mt-1.5 text-sm font-medium text-danger">
                  {errors.consent.message}
                </p>
              )}
            </div>

            {TURNSTILE_SITE_KEY && <Turnstile siteKey={TURNSTILE_SITE_KEY} onToken={setTurnstileToken} />}
          </div>
        )}
      </div>

      {serverError && (
        <div role="alert" className="mt-6 rounded-sm border border-danger/30 bg-danger-soft px-4 py-3 text-[0.9375rem] text-danger">
          {serverError}
        </div>
      )}

      <div className="mt-8 flex items-center gap-3">
        {step > 0 && (
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => goTo(step - 1)}
            disabled={busy}
            className="px-4"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span className="max-sm:sr-only">Back</span>
          </Button>
        )}
        <Button
          type="submit"
          size="lg"
          className="flex-1 sm:flex-none sm:min-w-52"
          disabled={busy}
          // Keep focus in the field on press: its blur validation would otherwise
          // insert an error above, shift this button, and swallow the click.
          onMouseDown={(e) => e.preventDefault()}
        >
          {busy ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              Sending
            </>
          ) : step < LEAD_STEPS.length - 1 ? (
            "Continue"
          ) : (
            "Send my interest"
          )}
        </Button>
      </div>
      {step === LEAD_STEPS.length - 1 && (
        <p className="mt-4 text-sm text-ink-3">
          No payment and no commitment. This is an inquiry, not a reservation.
        </p>
      )}
    </form>
  );
}
