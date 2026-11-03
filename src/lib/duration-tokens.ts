import { useState } from "react";

/*
 * ---------------------------------------------------------------------------
 * The beat, taken from the motion tokens rather than written as a number
 * ---------------------------------------------------------------------------
 *
 * docs/13 classifies a raw duration in component code as a P1, because a
 * component's CSS transitions follow a retuned `--dur-*` and its JavaScript
 * animations do not. An install that retunes the contract's motion tokens gets
 * a component whose two halves disagree, and a `// mirrors --dur-2` comment
 * reads as compliant while failing.
 *
 * `faq-guided-path` (#455) proved the fix on one component: pin a chain of
 * custom properties, resolve it once through the engine, and hand the resolved
 * seconds to Motion. This is that mechanism generalised, so the remaining
 * migrations are one edit each rather than one design each (#484).
 *
 * Four properties are load-bearing, and each is a real constraint:
 *
 * 1. **SSR-safe.** Nothing here touches `window`, `document` or
 *    `getComputedStyle` at module scope. A server render finds `scope.current`
 *    null and gets the authored default, which is what the markup would have
 *    animated to anyway.
 *
 * 2. **Once per mount, not per frame.** Every distinct token is resolved on
 *    its first read and cached for the life of the component. Reading computed
 *    style per frame is a layout-thrash source, and this deliberately reads at
 *    most once per token per mount.
 *
 * 3. **A real fallback.** A buyer installing into a vanilla shadcn app has no
 *    `--dur-*` tokens at all. Every path that fails to find a usable time
 *    returns the component's *authored* default rather than `0`, `NaN` or
 *    `undefined` - an animation that silently becomes instant is worse than
 *    one that ignores the token. Same class as the guarded Tier 3 fallbacks
 *    #87 introduced for colour.
 *
 * 4. **Reduced motion, through the mechanism the repo already has.** docs/04
 *    names `useReducedMotion()` as Motion's route and `gsap.matchMedia()` as
 *    GSAP's. Neither is re-implemented here. `useDurationTokens` is
 *    deliberately reduced-motion agnostic, because a GSAP component has
 *    already branched through `matchMedia` by the time it asks for a beat;
 *    `useTokenTransitions` in `lib/motion.ts` takes the component's own
 *    `useReducedMotion()` answer as a required argument and resolves the beat
 *    through `reducedBeatSeconds` when it is set. A listener in this file
 *    would be a second answer to a question the component has already
 *    answered, and the two would eventually disagree.
 */

/**
 * Where a beat comes from: a custom property, or a whole `var()` chain when the
 * component declares its own Tier 3 knob in front of the contract token.
 *
 * `"--dur-2"` is the ordinary case. `"var(--card-swap, var(--dur-2, 300ms))"`
 * is the docs/13 Tier 3 shape, and the author owns its literal tail.
 */
export type DurationSource = `--${string}` | `var(${string})`;

/**
 * docs/04's ceiling for movement under `prefers-reduced-motion: reduce`:
 * "opacity fades up to 200ms, static gradients, final-state rendering".
 */
const REDUCED_CEILING_SECONDS = 0.2;

/**
 * What a beat becomes under `prefers-reduced-motion: reduce`.
 *
 * ## Why this exists at all
 *
 * docs/04 allows **two** answers under reduce - an opacity fade of up to 200ms,
 * or final-state rendering - and which of them a component uses is a design
 * decision that belongs to the component. Before this function the token path
 * could only say one of them: a token-backed beat resolved to `0`, so
 * migrating a component that had deliberately chosen a 150ms fade silently
 * converted it to a snap. Nobody decided the snap was better; zero was just
 * the only reduce answer the vocabulary had. That is a gap in the helper, not
 * a defect in the component, and left unfixed it would have flattened every
 * remaining component with a deliberate reduce fade, one batch at a time.
 *
 * ## Why the reduce beat is a number and not a token
 *
 * Deliberately not `DurationSource`. The reduce beat is bounded by an
 * accessibility rule rather than by the design scale: its job is to avoid a
 * snap, not to carry the product's timing. A token-backed reduce beat would
 * follow a retune past docs/04's ceiling - an install setting `--dur-1: 1200ms`
 * would hand reduced-motion users a 1.2s fade - which is the one outcome the
 * rule exists to prevent. So the value is the component's own, and the ceiling
 * is enforced here rather than trusted.
 *
 * Routing every reduce beat through this function is also what keeps the
 * ratchet in `tests/motion-duration-tokens.spec.ts` honest. A bare
 * `duration: 0.15` is still a hardcoded beat and still fails the scan;
 * `reducedBeatSeconds(0.15)` is the one sanctioned way to write a reduce beat,
 * so a reader can find every one of them with a single grep.
 *
 * @param seconds The component's authored reduce beat. Omitted, zero, negative
 *   or non-finite all mean "no beat": final-state rendering, which is the
 *   default and the behaviour of every component migrated before this existed.
 * @returns Seconds, clamped to docs/04's 200ms ceiling.
 */
export function reducedBeatSeconds(seconds?: number): number {
  if (seconds === undefined || !Number.isFinite(seconds) || seconds <= 0) return 0;
  return Math.min(seconds, REDUCED_CEILING_SECONDS);
}

/** Resolves a token to seconds, the unit Motion and GSAP both take. */
export type DurationReader = (token: DurationSource, seconds: number) => number;

/**
 * The ref shape this module needs, written structurally rather than as
 * `RefObject<HTMLElement | null>`.
 *
 * `RefObject` is invariant in its parameter because `current` is mutable, so a
 * `useRef<HTMLDivElement>(null)` - which every caller has - is *not* assignable
 * to `RefObject<HTMLElement | null>`. Asking only for a readonly `current`
 * makes the ordinary ref assignable, and this module never writes to it.
 */
export interface DurationScope {
  readonly current: HTMLElement | null;
}

/**
 * One computed CSS `<time>` as a number of seconds, or `null` if it is not one.
 *
 * Written to accept what CSS actually hands back rather than one canonical
 * spelling. A computed `transition-duration` is always `Xs`, but a custom
 * property is substitution-only: its computed value is whatever token stream
 * the consumer wrote, so `--dur-2: 210ms`, `--dur-2: 0.21s` and a value padded
 * with whitespace are all ordinary and all arrive here verbatim. A unitless
 * number is accepted as seconds, which is both CSS's rule for `0` and Motion's
 * own unit.
 *
 * A list is read at its first entry. `transition-duration` is list-valued, so a
 * consumer writing `0.2s, 0.4s` into a token gets both back; the first is the
 * one that would apply to the first transitioned property.
 *
 * Non-positive is `null` rather than `0` on purpose. Zero is what the engine
 * computes for a declaration it could not use, so honouring it would turn a
 * malformed token into a silently instant animation - the one outcome property
 * 3 above exists to prevent. A consumer who wants no motion sets
 * `prefers-reduced-motion`, which is honoured, rather than zeroing a token.
 */
function parseSeconds(value: string): number | null {
  const first = value.split(",")[0];
  if (first === undefined) return null;
  const trimmed = first.trim();
  if (trimmed === "") return null;
  const match = /^(-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)(ms|s)?$/i.exec(trimmed);
  const magnitude = match?.[1];
  if (magnitude === undefined) return null;
  const parsed = Number(magnitude);
  if (!Number.isFinite(parsed)) return null;
  const seconds = match?.[2]?.toLowerCase() === "ms" ? parsed / 1000 : parsed;
  return seconds > 0 ? seconds : null;
}

/**
 * The engine's own answer for a chain the parser above could not read.
 *
 * A custom property is substitution-only, so `--dur-2: calc(2 * 150ms)` arrives
 * as that text and any parser in this file is a partial reimplementation of CSS
 * that will keep meeting values it does not know (#455 round 11). Assigning the
 * chain to the real `transition-duration` property gives the whole job to the
 * engine, which normalises every valid `<time>` expression to `Xs` and answers
 * an invalid one with that property's initial value.
 *
 * The declaration goes onto the scope element's own inline style rather than
 * onto a probe node appended beneath it. Appending a node - even a
 * `display: none` one removed in the same synchronous block - invalidates
 * `:nth-child`, `:last-child` and `:empty` on its siblings, and the two style
 * recalculations that follow can start a real transition on a sibling that has
 * one declared. Nothing is added to the tree here, so nothing else in the
 * document can observe the read.
 *
 * On the scope element itself the read is inert too: `transition-property: none`
 * is in force for the whole of it, so no transition can start while the probe
 * declarations are applied, and neither `transition-property` nor
 * `transition-duration` is itself an animatable property, so restoring them
 * cannot start one either. Both are set `!important` so an author rule carrying
 * `!important` cannot outrank the probe. The prior inline values, priorities
 * included, are restored in a `finally`.
 */
function probeSeconds(scope: HTMLElement, chain: string): number | null {
  const view = scope.ownerDocument.defaultView;
  if (view === null) return null;
  const inline = scope.style;
  const priorProperty = inline.getPropertyValue("transition-property");
  const priorPropertyPriority = inline.getPropertyPriority("transition-property");
  const priorDuration = inline.getPropertyValue("transition-duration");
  const priorDurationPriority = inline.getPropertyPriority("transition-duration");
  try {
    inline.setProperty("transition-property", "none", "important");
    inline.setProperty("transition-duration", chain, "important");
    return parseSeconds(view.getComputedStyle(scope).transitionDuration);
  } finally {
    inline.removeProperty("transition-property");
    inline.removeProperty("transition-duration");
    if (priorProperty !== "") {
      inline.setProperty("transition-property", priorProperty, priorPropertyPriority);
    }
    if (priorDuration !== "") {
      inline.setProperty("transition-duration", priorDuration, priorDurationPriority);
    }
  }
}

/**
 * One token's beat in seconds, resolved against the element it is scoped to.
 *
 * The cheap read comes first: a bare custom property is read straight off
 * computed style, which allocates nothing and mutates nothing. An empty answer
 * means the token is not defined anywhere up the tree - the vanilla shadcn case
 * - and the authored default is the answer. A value the parser cannot read is
 * handed to the engine through `probeSeconds`, which is the only path that
 * touches the DOM and is reached only by a consumer who wrote something the
 * grammar allows and this file does not model.
 *
 * A full `var()` chain skips the cheap read: its own tail is what makes it
 * resolve, and only the engine can perform the substitution.
 */
function resolveSeconds(
  scope: HTMLElement,
  token: DurationSource,
  seconds: number,
): number {
  if (token.startsWith("--")) {
    const view = scope.ownerDocument.defaultView;
    if (view === null) return seconds;
    const raw = view.getComputedStyle(scope).getPropertyValue(token);
    if (raw.trim() === "") return seconds;
    const direct = parseSeconds(raw);
    if (direct !== null) return direct;
    return probeSeconds(scope, `var(${token})`) ?? seconds;
  }
  return probeSeconds(scope, token) ?? seconds;
}

/**
 * Read a motion token as seconds, resolved against `scope` once per mount.
 *
 * The low-level half of this module, for the cases a `Transition` object is the
 * wrong shape: a GSAP tween's `duration`, a `setTimeout`, a stagger step. It is
 * deliberately **not** reduced-motion aware, because a GSAP component already
 * branches through `gsap.matchMedia()` (docs/04) and a second mechanism layered
 * underneath that one would fight it.
 *
 * ```tsx
 * const rootRef = useRef<HTMLDivElement>(null);
 * const readDuration = useDurationTokens(rootRef);
 * // inside useGSAP, after mount:
 * gsap.to(el, { x: 100, duration: readDuration("--dur-3", 0.6) });
 * ```
 *
 * @param scope Element the tokens are resolved against. Any element inside the
 *   component works; its root is the natural choice, because custom properties
 *   inherit and reading there honours an override written at `:root` **or** on
 *   any ancestor, which is what docs/13 Tier 3 rule 2 requires.
 * @returns A stable reader. Each distinct `token`/`seconds` pair is resolved on
 *   its first call after mount and cached for the life of the component; calls
 *   before the ref is attached return `seconds` and are not cached, so the
 *   first real read still resolves.
 */
export function useDurationTokens(scope: DurationScope): DurationReader {
  // `useState` with a lazy initialiser rather than `useCallback`: this is a
  // value created once and never recomputed, not a memoisation of a render, and
  // writing it that way keeps the reader's identity stable without declaring a
  // dependency list that claims something untrue about `scope.current`.
  const [read] = useState(() => createDurationReader(scope));
  return read;
}

/**
 * A reader bound to one scope, with its own cache.
 *
 * The cache is what makes "once per mount" true. A read before the ref is
 * attached - a server render, or the window between the first render and the
 * commit - answers with the authored default and is deliberately *not* cached,
 * so the first read that can resolve still does.
 */
function createDurationReader(scope: DurationScope): DurationReader {
  const cache = new Map<string, number>();
  return (token, seconds) => {
    const element = scope.current;
    if (element === null) return seconds;
    const key = `${token}|${seconds}`;
    const held = cache.get(key);
    if (held !== undefined) return held;
    const resolved = resolveSeconds(element, token, seconds);
    cache.set(key, resolved);
    return resolved;
  };
}

