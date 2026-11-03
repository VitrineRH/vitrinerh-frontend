"use client";
import * as React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
interface SplitTextProps {
    text: string;
    by?: "char" | "word";
    delay?: number;
    stagger?: number;
    duration?: number;
    y?: number;
    blur?: boolean;
    once?: boolean;
    immediate?: boolean;
    /**
     * Animation mode: `"reveal"` (default, staggered per-char / per-word reveal) or `"tracking"`
     * (line-by-line flip-in: each line rises from y 100% to 0 behind a mask, opacity 0 to 1, while
     * letter-spacing expands from `trackingFrom` to 0). Tracking mode splits lines on newlines (\n);
     * `by`, `y` and `blur` have no effect there.
     */
    mode?: "reveal" | "tracking";
    /** Starting letter-spacing for tracking mode (a CSS letter-spacing value); expands to 0 */
    trackingFrom?: string;
    className?: string;
}
function splitGraphemes(text: string): string[] {
    if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
        const segmenter = new Intl.Segmenter(undefined, {
            granularity: "grapheme",
        });
        return Array.from(segmenter.segment(text), (s) => s.segment);
    }
    return Array.from(text);
}
function groupByWord(graphemes: string[]): string[][] {
    const groups: string[][] = [];
    let current: string[] = [];
    for (const g of graphemes) {
        if (g === " ") {
            if (current.length)
                groups.push(current);
            groups.push([g]);
            current = [];
        }
        else {
            current.push(g);
        }
    }
    if (current.length)
        groups.push(current);
    return groups;
}
export function SplitText({ text, by = "char", delay = 0, stagger: staggerProp, duration = 0.6, y = 16, blur = true, once = true, immediate = false, mode = "reveal", trackingFrom = "-0.2em", className, }: SplitTextProps) {
    // Why no inline default: line intervals need to be much larger than per-char ones, so an
    // omitted stagger defaults by mode; reveal mode stays at 0.03, unchanged.
    const stagger = staggerProp ?? (mode === "tracking" ? 0.12 : 0.03);
    const reducedMotion = useReducedMotion();
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    const groups = React.useMemo(() => {
        if (by === "word")
            return text
                .split(" ")
                .map((w, i, arr) => [i < arr.length - 1 ? w + " " : w]);
        return groupByWord(splitGraphemes(text));
    }, [text, by]);
    // Tracking mode splits on explicit newlines. Why not measure visual lines: measuring reads
    // the DOM, so the first render could not match SSR, and every resize would reflow and replay.
    const lines = React.useMemo(() => text.split("\n"), [text]);
    if (mode === "tracking") {
        if (mounted && reducedMotion) {
            // reduced-motion: show immediately, keeping line breaks
            return (<span className={cn("inline-block whitespace-pre-line", className)}>
          {text}
        </span>);
        }
        const lineContainer: Variants = {
            hidden: {},
            visible: {
                transition: { staggerChildren: stagger, delayChildren: delay },
            },
        };
        const line: Variants = {
            hidden: {
                y: "100%",
                opacity: immediate ? 1 : 0,
                letterSpacing: trackingFrom,
            },
            visible: {
                y: "0%",
                opacity: 1,
                letterSpacing: "0em",
                transition: { duration, ease: [0.22, 1, 0.36, 1] },
            },
        };
        return (<span className={cn("inline-block", className)}>
        <span className="sr-only">{text}</span>
        <motion.span className="block" variants={lineContainer} initial="hidden" {...(immediate
            ? { animate: "visible" as const }
            : {
                whileInView: "visible" as const,
                viewport: { once, margin: "-10% 0px" },
            })} aria-hidden>
          {lines.map((l, i) => (
            // The outer span is the mask: overflow-hidden lets the line flip up from the bottom
            // edge; 0.1em padding offset by negative margin keeps descenders (g, y) from clipping.
            <span key={`l-${i}`} className="-my-[0.1em] block overflow-hidden py-[0.1em]">
              <motion.span className="block whitespace-pre-wrap" variants={line}>
                {/* An empty line still takes up a line's height */}
                {l.length ? l : " "}
              </motion.span>
            </span>))}
        </motion.span>
      </span>);
    }
    if (mounted && reducedMotion) {
        return <span className={className}>{text}</span>;
    }
    const container: Variants = {
        hidden: {},
        visible: {
            transition: { staggerChildren: stagger, delayChildren: delay },
        },
    };
    const unit: Variants = {
        hidden: {
            opacity: immediate ? 1 : 0,
            y,
            ...(blur ? { filter: "blur(8px)" } : {}),
        },
        visible: {
            opacity: 1,
            y: 0,
            ...(blur ? { filter: "blur(0px)" } : {}),
            transition: { duration, ease: [0.22, 1, 0.36, 1] },
        },
    };
    let index = -1;
    return (<span className={cn("inline-block", className)}>
      <span className="sr-only">{text}</span>
      <motion.span className="inline-block" variants={container} initial="hidden" {...(immediate
        ? { animate: "visible" as const }
        : {
            whileInView: "visible" as const,
            viewport: { once, margin: "-10% 0px" },
        })} aria-hidden>
        {groups.map((group, gi) => (<span key={`g-${gi}`} className="inline-block whitespace-pre">
            {group.map((u) => {
                index += 1;
                return (<motion.span key={`${u}-${index}`} className="inline-block whitespace-pre" variants={unit}>
                  {u}
                </motion.span>);
            })}
          </span>))}
      </motion.span>
    </span>);
}
