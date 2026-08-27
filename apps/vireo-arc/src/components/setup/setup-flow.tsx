"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Moon,
  Sparkles,
  Sun,
} from "lucide-react";
import { Button, cn } from "@cardioline/ui";
import { asset } from "@/lib/asset";
import { useTheme, type Theme } from "@/components/theme/theme-provider";
import { densities, useSession, type Density } from "@/lib/session";
import { homeHref, moduleLabel, personaRoles, roleById } from "@/lib/roles";
import { WorkspacePreview } from "@/components/setup/workspace-preview";

/**
 * First-login setup: a short funnel that picks one of the existing role
 * presets and two interface preferences, then drops the user into the home
 * that role declares.
 *
 * It reads and writes the same `roles.ts` presets the administration screens
 * edit — there is no second persona model behind this. Choosing here is
 * choosing a role, which is what decides navigation, home and permissions.
 */

const steps = [
  { id: "welcome", label: "Welcome" },
  { id: "role", label: "Your role" },
  { id: "workspace", label: "Your workspace" },
  { id: "theme", label: "Appearance" },
  { id: "density", label: "Density" },
  { id: "summary", label: "Ready" },
] as const;

type StepId = (typeof steps)[number]["id"];

export function SetupFlow() {
  const router = useRouter();
  const { state, completeSetup } = useSession();
  const { theme, setTheme } = useTheme();

  const [index, setIndex] = React.useState(0);
  const [roleId, setRoleId] = React.useState(state.roleId);
  const [density, setDensity] = React.useState<Density>(state.density);

  const step: StepId = steps[index].id;
  const role = roleById(roleId) ?? personaRoles[0];
  const back = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(steps.length - 1, i + 1));

  const finish = () => {
    completeSetup({ roleId, density });
    router.push(homeHref(role));
  };

  /* Role is the only step that can be reached without a prior answer; the
     rest always have a defaulted value, so Next is never a dead end. */
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10 sm:px-8">
        <Header index={index} />

        <div className="flex flex-1 flex-col justify-center py-8">
          {/* `key` restarts the entrance transition on every step. */}
          <div key={step} className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300">
            {step === "welcome" && <WelcomeStep />}
            {step === "role" && (
              <RoleStep roleId={roleId} onSelect={setRoleId} />
            )}
            {step === "workspace" && <WorkspaceStep role={role} density={density} />}
            {step === "theme" && <ThemeStep theme={theme} onSelect={setTheme} />}
            {step === "density" && (
              <DensityStep
                role={role}
                density={density}
                onSelect={setDensity}
              />
            )}
            {step === "summary" && (
              <SummaryStep role={role} theme={theme} density={density} />
            )}
          </div>
        </div>

        <footer className="flex items-center justify-between gap-4 border-t border-border pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={back}
            disabled={index === 0}
            className={cn(index === 0 && "invisible")}
          >
            <ArrowLeft />
            Back
          </Button>
          <p className="text-xs text-muted-foreground" aria-live="polite">
            Step {index + 1} of {steps.length} · {steps[index].label}
          </p>
          {step === "summary" ? (
            <Button type="button" onClick={finish}>
              Enter Vireo ARK
              <ArrowRight />
            </Button>
          ) : (
            <Button type="button" onClick={next}>
              {step === "welcome" ? "Start setup" : "Next"}
              <ArrowRight />
            </Button>
          )}
        </footer>
      </div>
    </main>
  );
}

/* ─── Chrome ─────────────────────────────────────────────────────── */

function Header({ index }: { index: number }) {
  return (
    <header className="space-y-5">
      <Image
        src={asset("/brand/vireo-ark.svg")}
        alt="Vireo ARK"
        width={390}
        height={67}
        priority
        className="h-5 w-auto dark:hidden"
      />
      <Image
        src={asset("/brand/vireo-ark-white.svg")}
        alt="Vireo ARK"
        width={390}
        height={67}
        priority
        className="hidden h-5 w-auto dark:block"
      />
      {/* Progress is a labelled list, not just coloured bars, so the current
          step is available to assistive tech and not signalled by color only. */}
      <ol className="flex items-center gap-1.5">
        {steps.map((item, position) => {
          const done = position < index;
          const current = position === index;
          return (
            <li key={item.id} className="flex-1">
              <span className="sr-only">
                {item.label}
                {current ? " — current step" : done ? " — completed" : ""}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "block h-1 rounded-full transition-colors duration-500",
                  done || current ? "bg-primary" : "bg-muted",
                )}
              />
            </li>
          );
        })}
      </ol>
    </header>
  );
}

function Title({ title, lead }: { title: string; lead?: string }) {
  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-3xl font-bold text-foreground">{title}</h1>
      {lead && <p className="mt-2 text-muted-foreground">{lead}</p>}
    </div>
  );
}

/** Shared selectable-card chrome: a real radio underneath, so keyboard and
 *  screen readers get grouping and arrow-key navigation for free. */
function ChoiceCard({
  name,
  value,
  checked,
  onSelect,
  className,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onSelect: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        "group relative flex cursor-pointer flex-col rounded-lg border-2 bg-card p-5 text-left transition-colors",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        checked
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/40 hover:bg-muted/50",
        className,
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onSelect(value)}
        className="sr-only"
      />
      {/* Selection is marked by a check as well as by color and border. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
          checked
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/30",
        )}
      >
        {checked && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      {children}
    </label>
  );
}

/* ─── Steps ──────────────────────────────────────────────────────── */

function WelcomeStep() {
  return (
    <div className="space-y-8">
      <Title
        title="Let's set up your Vireo ARK"
        lead="Tell us how you work and we'll prepare your workspace."
      />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Your home", "Where you land at sign-in"],
          ["Your shortcuts", "The actions you reach for"],
          ["Your density", "How much fits on screen"],
          ["Your modules", "Only the tools you use"],
        ].map(([title, detail]) => (
          <li key={title} className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
          </li>
        ))}
      </ul>
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        Takes about a minute. You can change any of it later.
      </p>
    </div>
  );
}

function RoleStep({
  roleId,
  onSelect,
}: {
  roleId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <fieldset className="space-y-8">
      <legend>
        <Title
          title="What best describes your role?"
          lead="This sets your permissions, your navigation and where you start."
        />
      </legend>
      <div className="grid gap-4 sm:grid-cols-2">
        {personaRoles.map((persona) => {
          const Icon = persona.preset.icon;
          const checked = persona.id === roleId;
          return (
            <ChoiceCard
              key={persona.id}
              name="role"
              value={persona.id}
              checked={checked}
              onSelect={onSelect}
            >
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                  checked
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="mt-4 block pr-7 font-heading text-lg font-bold text-foreground">
                {persona.name}
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                {persona.preset.tagline}
              </span>
            </ChoiceCard>
          );
        })}
      </div>
    </fieldset>
  );
}

function WorkspaceStep({
  role,
  density,
}: {
  role: ReturnType<typeof roleById> & object;
  density: Density;
}) {
  const preset = role.preset;
  return (
    <div className="space-y-8">
      <Title
        title={`Here's your Vireo ARK, ${role.name}`}
        lead={preset?.promise}
      />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <WorkspacePreview role={role} density={density} />
        <div className="space-y-6">
          <Detail
            title="You'll start on"
            items={[moduleLabel(role, role.landing)]}
            highlight
          />
          <Detail title="Ranked first" items={preset?.priorities ?? []} />
          <Detail title="Your main actions" items={preset?.actions ?? []} />
        </div>
      </div>
    </div>
  );
}

function Detail({
  title,
  items,
  highlight,
}: {
  title: string;
  items: string[];
  highlight?: boolean;
}) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <li
            key={item}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              highlight
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground",
            )}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ThemeStep({
  theme,
  onSelect,
}: {
  theme: Theme;
  onSelect: (theme: Theme) => void;
}) {
  const options: { id: Theme; label: string; detail: string; icon: typeof Sun }[] = [
    { id: "light", label: "Light", detail: "Bright rooms and shared screens", icon: Sun },
    { id: "dark", label: "Dark", detail: "Reading rooms and long shifts", icon: Moon },
  ];
  return (
    <fieldset className="space-y-8">
      <legend>
        <Title
          title="How should it look?"
          lead="The change applies as you pick, so you can see it before deciding."
        />
      </legend>
      <div className="grid gap-4 sm:grid-cols-2">
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <ChoiceCard
              key={option.id}
              name="theme"
              value={option.id}
              checked={theme === option.id}
              onSelect={(value) => onSelect(value as Theme)}
            >
              <span className="flex items-center gap-2 pr-7">
                <Icon className="h-4 w-4 text-primary" />
                <span className="font-heading text-lg font-bold text-foreground">
                  {option.label}
                </span>
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                {option.detail}
              </span>
              {/* Miniature of the real chrome in that theme. */}
              <span
                aria-hidden="true"
                className={cn(
                  "mt-4 block overflow-hidden rounded-md border",
                  option.id === "dark"
                    ? "border-slate-700 bg-[#071046]"
                    : "border-slate-200 bg-white",
                )}
              >
                <span className="flex">
                  <span
                    className={cn(
                      "w-1/4 space-y-1 p-2",
                      option.id === "dark" ? "bg-[#0b1440]" : "bg-slate-50",
                    )}
                  >
                    {[0, 1, 2].map((row) => (
                      <span
                        key={row}
                        className={cn(
                          "block h-1 rounded-full",
                          row === 0
                            ? "bg-primary"
                            : option.id === "dark"
                              ? "bg-slate-600"
                              : "bg-slate-300",
                        )}
                      />
                    ))}
                  </span>
                  <span className="flex-1 space-y-1.5 p-2">
                    <span
                      className={cn(
                        "block h-1.5 w-1/3 rounded-full",
                        option.id === "dark" ? "bg-slate-500" : "bg-slate-400",
                      )}
                    />
                    {[0, 1, 2].map((row) => (
                      <span
                        key={row}
                        className={cn(
                          "block h-1 rounded-full",
                          option.id === "dark" ? "bg-slate-700" : "bg-slate-200",
                        )}
                      />
                    ))}
                  </span>
                </span>
              </span>
            </ChoiceCard>
          );
        })}
      </div>
    </fieldset>
  );
}

function DensityStep({
  role,
  density,
  onSelect,
}: {
  role: ReturnType<typeof roleById> & object;
  density: Density;
  onSelect: (density: Density) => void;
}) {
  return (
    <fieldset className="space-y-8">
      <legend>
        <Title
          title="How much do you want on screen?"
          lead="This changes tables, lists and the Exam Inbox across the product."
        />
      </legend>
      <div className="grid gap-4 sm:grid-cols-2">
        {densities.map((option) => (
          <ChoiceCard
            key={option.id}
            name="density"
            value={option.id}
            checked={density === option.id}
            onSelect={(value) => onSelect(value as Density)}
          >
            <span className="pr-7 font-heading text-lg font-bold text-foreground">
              {option.label}
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">
              {option.description}
            </span>
            <WorkspacePreview
              role={role}
              density={option.id}
              className="mt-4 shadow-none"
            />
            <span className="mt-3 flex flex-wrap gap-1.5">
              {option.detail.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </span>
          </ChoiceCard>
        ))}
      </div>
    </fieldset>
  );
}

function SummaryStep({
  role,
  theme,
  density,
}: {
  role: ReturnType<typeof roleById> & object;
  theme: Theme;
  density: Density;
}) {
  const rows = [
    ["Role", role.name],
    ["Home", moduleLabel(role, role.landing)],
    ["Theme", theme === "dark" ? "Dark" : "Light"],
    ["Density", density === "compact" ? "Compact" : "Comfortable"],
  ];
  return (
    <div className="space-y-8">
      <Title
        title="Your Vireo ARK is ready."
        lead="You can change appearance and density any time in Settings."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <dl className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          {rows.map(([label, value]) => (
            <div key={label} className="bg-card p-5">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {label}
              </dt>
              <dd className="mt-1 font-heading text-lg font-bold text-foreground">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <WorkspacePreview role={role} density={density} />
      </div>
    </div>
  );
}
