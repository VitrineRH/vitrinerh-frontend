"use client";

import {
  useId,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useGSAP } from "@gsap/react";

import { useDurationTokens } from "@/lib/duration-tokens";
import { gsap, ScrollTrigger } from "@/lib/gsap-scroll-trigger";
import { cn } from "@/lib/utils";

export interface ProcessCardStep {
  /** Stable React key. */
  id: string;
  /** Step heading. */
  title: string;
  /** Step explanation. */
  description: string;
  /** Optional short supporting points. */
  details?: string[];
  /** Optional icon supplied by the consumer. */
  icon?: ReactNode;
}

export interface ProcessCardsTimelineProps {
  /** Section heading rendered as h2. */
  title: string;
  /** Optional section introduction. */
  description?: string;
  /** Three to six steps in process order. */
  steps: ProcessCardStep[];
  /** Visible vertical offset between stacked cards in pixels. @default 24 */
  stackOffset?: number;
  /** Additional classes merged onto the section root with cn(). */
  className?: string;
}

type ProcessTimelineStyle = CSSProperties & {
  "--process-stack-offset": string;
};

const DESKTOP_MOTION_QUERY =
  "(prefers-reduced-motion: no-preference) and (min-width: 64rem) and (hover: hover) and (pointer: fine)";

/*
 * The authored layout is an ordinary static list. Only the composite desktop
 * matchMedia branch adds data-enhanced, which activates sticky shells. The
 * root custom property is the sole source of stack spacing and every card top
 * is derived from it. Six selectors cover the component's specified maximum.
 */
const PROCESS_CARDS_CSS = `
.te-process-cards {
  --process-stack-base: clamp(5.5rem, 10vh, 7rem);
}

/*
 * Stacked cards overlap, so the surface has to be opaque: a translucent one
 * lets every collapsed card underneath print its step label and heading
 * through the card on top. The base is --background plus one --surface tint,
 * which is exactly what this card already composited to on a --surface host,
 * and the decorative layer still adds the second tint, so the resting
 * appearance is unchanged.
 */
.te-process-card__surface {
  position: relative;
  isolation: isolate;
  min-height: 16rem;
  overflow: hidden;
  border-radius: 1.75rem;
  background-color: var(--background);
  background-image: linear-gradient(var(--surface), var(--surface));
  transform-origin: top center;
}

.te-process-card__layer {
  position: absolute;
  z-index: 0;
  inset: 0;
  pointer-events: none;
  border: 1px solid var(--process-card-border, var(--border));
  border-radius: inherit;
  background: var(--process-card, var(--surface));
  box-shadow: 0 1.75rem 4rem -2.5rem
    var(--process-card-shadow, var(--background));
}

.te-process-card__number {
  /* te-primary-text-ok: tints an aria-hidden step icon, so this is a graphic at
     3:1, not text. */
  color: var(--process-card-number, var(--primary));
}

/*
 * The stack rail is the collapsed card's spine label, never a second header.
 * A covered card shows only its top --process-stack-offset strip, so the rail
 * is the one thing naming it there. It exists only in the enhanced branch and
 * starts fully transparent; GSAP fades it in as the next card closes over this
 * one, which is why the step title cannot print twice on an open card.
 */
.te-process-card__stack-rail {
  position: absolute;
  z-index: 2;
  top: 0;
  inset-inline: 1.5rem;
  display: none;
  height: var(--process-stack-offset);
  align-items: center;
  gap: 0.625rem;
  pointer-events: none;
  font-size: 0.75rem;
  line-height: 1;
  white-space: nowrap;
}

.te-process-card__stack-title {
  min-width: 0;
  overflow: hidden;
  color: var(--foreground);
  font-weight: 600;
  text-overflow: ellipsis;
}

@media (min-width: 40rem) {
  .te-process-card__stack-rail {
    inset-inline: 2rem;
  }
}

@media ${DESKTOP_MOTION_QUERY} {
  .te-process-cards[data-enhanced="true"] .te-process-card__shell {
    position: sticky;
    top: var(--process-stack-base);
  }

  .te-process-cards[data-enhanced="true"] .te-process-card__stack-rail {
    display: flex;
    opacity: 0;
    font-size: clamp(
      0.625rem,
      calc(var(--process-stack-offset) - 2px),
      0.75rem
    );
  }

  .te-process-cards[data-enhanced="true"]
    .te-process-card__shell[data-step-index="1"] {
    top: calc(var(--process-stack-base) + var(--process-stack-offset));
  }

  .te-process-cards[data-enhanced="true"]
    .te-process-card__shell[data-step-index="2"] {
    top: calc(
      var(--process-stack-base) + var(--process-stack-offset) +
        var(--process-stack-offset)
    );
  }

  .te-process-cards[data-enhanced="true"]
    .te-process-card__shell[data-step-index="3"] {
    top: calc(
      var(--process-stack-base) + var(--process-stack-offset) +
        var(--process-stack-offset) + var(--process-stack-offset)
    );
  }

  .te-process-cards[data-enhanced="true"]
    .te-process-card__shell[data-step-index="4"] {
    top: calc(
      var(--process-stack-base) + var(--process-stack-offset) +
        var(--process-stack-offset) + var(--process-stack-offset) +
        var(--process-stack-offset)
    );
  }

  .te-process-cards[data-enhanced="true"]
    .te-process-card__shell[data-step-index="5"] {
    top: calc(
      var(--process-stack-base) + var(--process-stack-offset) +
        var(--process-stack-offset) + var(--process-stack-offset) +
        var(--process-stack-offset) + var(--process-stack-offset)
    );
  }
}
`;

function clampStackOffset(value: number): number {
  if (!Number.isFinite(value)) return 24;
  return Math.min(40, Math.max(12, value));
}

/**
 * Process Cards Timeline is a semantic process section whose ordered cards
 * form a native-scroll depth stack on fine-pointer desktop layouts.
 *
 * SSR, no-JS, mobile, coarse-pointer and reduced-motion paths all render the
 * same complete, static section: a step header row, then the heading, copy and
 * supporting points, top-anchored so no card carries dead vertical space. In
 * the enhanced branch each sticky list item remains an untouched layout shell:
 * GSAP reveals only the heading group and card copy, then scrubs the preceding
 * card's inner surface as the next card reaches its CSS sticky position. The
 * surface scales to 0.96 while only its decorative layer fades to 0.72, keeping
 * headings, labels and body copy at full text opacity for contrast. The
 * collapsed spine rail fades in for exactly the same card at the point its own
 * heading is covered, so the two never state the step title at once. No trigger
 * pins the viewport or intercepts native scrolling.
 */
export function ProcessCardsTimeline({
  title,
  description,
  steps,
  stackOffset = 24,
  className,
}: ProcessCardsTimelineProps) {
  const scope = useRef<HTMLElement | null>(null);
  /*
   * The beats below are read from the motion tokens rather than written as
   * numbers (#484). This component is GSAP, so it takes them through
   * `useDurationTokens` directly for a tween's `duration` rather than through
   * `useTokenTransitions`, which is Motion-shaped. The reader is resolved
   * against the section root, so an override written at `:root` or on any
   * ancestor this timeline is composed inside is honoured (docs/13 Tier 3
   * rule 2), and every read happens inside `useGSAP`, after the ref is
   * attached.
   *
   * Reduced motion is untouched and stays the component's own answer: the
   * whole enhanced branch lives inside one `gsap.matchMedia` query requiring
   * `(prefers-reduced-motion: no-preference)`, so under the preference no
   * tween and no ScrollTrigger is created and the authored markup is already
   * the final state. There is no reduce fade here to preserve or to flatten.
   */
  const readBeat = useDurationTokens(scope);
  const generatedId = useId();
  const headingId = `te-process-cards-${generatedId.replaceAll(":", "")}`;
  const resolvedStackOffset = clampStackOffset(stackOffset);
  const orderKey = JSON.stringify(steps.map((step) => step.id));
  const timelineStyle: ProcessTimelineStyle = {
    "--process-stack-offset": `${resolvedStackOffset}px`,
  };

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add(DESKTOP_MOTION_QUERY, () => {
        root.setAttribute("data-enhanced", "true");

        const heading = root.querySelector<HTMLElement>(
          "[data-process-heading]",
        );
        if (heading) {
          const revealHeading = gsap.from(heading, {
            y: 24,
            autoAlpha: 0,
            // Section entrance, on the token that carries them.
            duration: readBeat("--dur-3", 0.6),
            ease: "expo.out",
            paused: true,
            immediateRender: false,
          });

          ScrollTrigger.create({
            trigger: heading,
            start: "top 85%",
            once: true,
            onEnter: () => revealHeading.play(),
          });
        }

        const cards = gsap.utils.toArray<HTMLElement>(
          "[data-process-card]",
          root,
        );

        cards.forEach((card, index) => {
          const content = card.querySelector<HTMLElement>(
            "[data-process-content]",
          );
          if (content) {
            const revealContent = gsap.from(content, {
              y: 20,
              opacity: 0,
              duration: readBeat("--dur-3", 0.6),
              ease: "expo.out",
              paused: true,
              immediateRender: false,
            });

            ScrollTrigger.create({
              trigger: card,
              start: "top 88%",
              once: true,
              onEnter: () => revealContent.play(),
            });
          }

          const nextCard = cards[index + 1];
          if (!nextCard) return;

          const surface = card.querySelector<HTMLElement>(
            "[data-process-surface]",
          );
          const layer = card.querySelector<HTMLElement>(
            "[data-process-depth-layer]",
          );
          if (!surface || !layer) return;

          /*
           * One depth tween per preceding card. The wrapper receives only the
           * scale and the decorative layer receives only the opacity change,
           * so all required text remains at opacity 1 throughout the scrub.
           */
          gsap.to([surface, layer], {
            scale: (targetIndex: number) =>
              targetIndex === 0 ? 0.96 : 1,
            opacity: (targetIndex: number) =>
              targetIndex === 1 ? 0.72 : 1,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: {
              trigger: nextCard,
              start: "top 82%",
              end: () => {
                const restingTop = Number.parseFloat(
                  getComputedStyle(nextCard).top,
                );
                return `top ${Number.isFinite(restingTop) ? restingTop : 0}px`;
              },
              scrub: 0.4,
              invalidateOnRefresh: true,
            },
          });

          const rail = card.querySelector<HTMLElement>(
            "[data-process-stack-rail]",
          );
          const cardTitle = card.querySelector<HTMLElement>(
            "[data-process-title]",
          );
          if (!rail || !cardTitle) return;

          /*
           * The spine label is the collapsed state's only identifier, so it is
           * revealed exactly when this card's own heading goes behind the next
           * card and hidden again on the way back up. Reading the heading
           * offset at refresh time keeps the handover tied to real geometry
           * rather than to a guessed scroll fraction. The beat is taken from
           * --dur-2 rather than written as 0.3: the comment that used to say
           * "0.3s mirrors --dur-2" named the right token and the right
           * number, and still left this fade fixed while the CSS around it
           * followed a retune.
           */
          const revealRail = gsap.fromTo(
            rail,
            { autoAlpha: 0 },
            {
              autoAlpha: 1,
              duration: readBeat("--dur-2", 0.3),
              ease: "power1.out",
              paused: true,
              immediateRender: true,
            },
          );

          ScrollTrigger.create({
            trigger: nextCard,
            start: () => {
              const restingTop = Number.parseFloat(
                getComputedStyle(card).top,
              );
              const headingOffset =
                cardTitle.getBoundingClientRect().top -
                card.getBoundingClientRect().top;
              const handover =
                (Number.isFinite(restingTop) ? restingTop : 0) + headingOffset;
              return `top ${handover}px`;
            },
            onEnter: () => revealRail.play(),
            onLeaveBack: () => revealRail.reverse(),
            invalidateOnRefresh: true,
          });
        });

        let active = true;
        void document.fonts.ready.then(() => {
          if (active) ScrollTrigger.refresh();
        });

        return () => {
          active = false;
          root.removeAttribute("data-enhanced");
        };
      });

      return () => mm.revert();
    },
    {
      scope,
      dependencies: [orderKey, readBeat, resolvedStackOffset],
      revertOnUpdate: true,
    },
  );

  return (
    <section
      ref={scope}
      aria-labelledby={headingId}
      data-process-cards-timeline=""
      style={timelineStyle}
      className={cn(
        "te-process-cards relative w-full py-10 sm:py-14 lg:py-20",
        className,
      )}
    >
      <style href="te-process-cards-timeline" precedence="medium">
        {PROCESS_CARDS_CSS}
      </style>

      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
        <div data-process-heading className="max-w-xl lg:pt-8">
          <h2
            id={headingId}
            className="text-balance text-3xl font-semibold tracking-tight text-black sm:text-4xl lg:text-5xl"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>

        <ol
          data-process-list
          className="m-0 flex min-w-0 list-none flex-col gap-5 p-0"
        >
          {steps.map((step, index) => (
            <li
              key={step.id}
              data-process-card
              data-step-index={index}
              className="te-process-card__shell relative min-w-0"
              style={{ zIndex: index + 1 }}
            >
              <div
                data-process-surface
                className="te-process-card__surface p-6 sm:p-8"
              >
                <span
                  aria-hidden="true"
                  data-process-depth-layer
                  className="te-process-card__layer"
                />

                <div
                  aria-hidden="true"
                  data-process-stack-rail
                  className="te-process-card__stack-rail"
                >
                  <span className="shrink-0 font-semibold uppercase tracking-[0.16em] text-foreground">
                    Passo {index + 1} de {steps.length}
                  </span>
                  <span className="h-3 w-px shrink-0 bg-border" />
                  <span
                    data-process-stack-title
                    className="te-process-card__stack-title"
                  >
                    {step.title}
                  </span>
                </div>

                <div
                  data-process-content
                  className="relative z-10 flex flex-col"
                >
                  <div className="flex items-center justify-between gap-6 border-b border-border pb-5">
                    <span
                      data-process-step-label
                      className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                    >
                      Passo {index + 1} de {steps.length}
                    </span>
                    {step.icon ? (
                      <span
                        aria-hidden="true"
                        className="te-process-card__number pointer-events-none flex size-10 shrink-0 items-center justify-center rounded-full border border-current/20"
                      >
                        {step.icon}
                      </span>
                    ) : null}
                  </div>

                  <div className="pt-6">
                    <h3
                      data-process-title
                      className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
                    >
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>

                    {step.details && step.details.length > 0 ? (
                      <ul className="mt-6 flex list-none flex-wrap gap-2 p-0">
                        {step.details.map((detail) => (
                          <li
                            key={detail}
                            className="rounded-full border border-border bg-background/35 px-3 py-1.5 text-xs font-medium text-foreground"
                          >
                            {detail}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
