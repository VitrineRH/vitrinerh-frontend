"use client";
import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue, } from "motion/react";
interface ScrollTextHighlightProps {
    text: string;
    by?: "char" | "word";
    container?: React.RefObject<HTMLElement | null>;
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
export function ScrollTextHighlight({ text, by = "char", container, className, }: ScrollTextHighlightProps) {
    const targetRef = React.useRef<HTMLParagraphElement>(null);
    const reducedMotion = useReducedMotion();
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    const units = React.useMemo(() => {
        if (by === "word")
            return text
                .split(" ")
                .map((w, i, arr) => (i < arr.length - 1 ? w + " " : w));
        return splitGraphemes(text);
    }, [text, by]);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        container,
        offset: ["start end", "end start"],
    });
    if (mounted && reducedMotion) {
        return <p className={className}>{text}</p>;
    }
    return (<p ref={targetRef} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {units.map((unit, i) => (<HighlightUnit key={`${unit}-${i}`} index={i} total={units.length} progress={scrollYProgress}>
            {unit}
          </HighlightUnit>))}
      </span>
    </p>);
}
function HighlightUnit({ index, total, progress, children, }: {
    index: number;
    total: number;
    progress: MotionValue<number>;
    children: React.ReactNode;
}) {
    const start = index / total;
    const end = (index + 1) / total;
    const opacity = useTransform(progress, [start, end], [0.2, 1]);
    return <motion.span style={{ opacity }}>{children}</motion.span>;
}
