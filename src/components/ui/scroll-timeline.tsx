"use client";
import * as React from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, } from "motion/react";
import { cn } from "@/lib/utils";
const RAIL_X = 24;
const CAP_SIZE = 10;
interface ScrollTimelineContextValue {
    container: React.RefObject<HTMLElement | null> | undefined;
    activationLine: number;
    isStatic: boolean;
}
const ScrollTimelineContext = React.createContext<ScrollTimelineContextValue | null>(null);
interface ScrollTimelineProps {
    children: React.ReactNode;
    container?: React.RefObject<HTMLElement | null>;
    activationLine?: number;
    className?: string;
}
export function ScrollTimeline({ children, container, activationLine = 0.5, className, }: ScrollTimelineProps) {
    const railRef = React.useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();
    const isStatic = Boolean(reducedMotion);
    const { scrollYProgress } = useScroll({
        target: railRef,
        container,
        offset: [`start ${activationLine}`, `end ${activationLine}`],
    });
    const [railHeight, setRailHeight] = React.useState(0);
    React.useEffect(() => {
        const el = railRef.current;
        if (!el)
            return;
        const update = () => setRailHeight(el.offsetHeight);
        update();
        const observer = new ResizeObserver(update);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    const capY = useTransform(scrollYProgress, (v) => v * railHeight - CAP_SIZE / 2);
    const value = React.useMemo<ScrollTimelineContextValue>(() => ({ container, activationLine, isStatic }), [container, activationLine, isStatic]);
    return (<ScrollTimelineContext.Provider value={value}>
      <div ref={railRef} className={cn("relative", className)}>
        
        <span aria-hidden className="pointer-events-none absolute top-0 bottom-0 w-px -translate-x-1/2 bg-neutral-200 dark:bg-neutral-800" style={{ left: RAIL_X }}/>
        
        <motion.span aria-hidden className="pointer-events-none absolute top-0 bottom-0 w-px origin-top bg-neutral-900 dark:bg-neutral-100" style={{
            left: RAIL_X,
            x: "-50%",
            scaleY: isStatic ? 1 : scrollYProgress,
        }}/>
        
        {!isStatic && railHeight > 0 && (<motion.span aria-hidden className="pointer-events-none absolute top-0 rounded-full bg-neutral-900 shadow-[0_0_10px_2px_rgba(23,23,23,0.45)] dark:bg-neutral-100 dark:shadow-[0_0_10px_2px_rgba(245,245,245,0.45)]" style={{
                left: RAIL_X,
                width: CAP_SIZE,
                height: CAP_SIZE,
                x: "-50%",
                y: capY,
            }}/>)}
        <ol className="relative m-0 list-none p-0">{children}</ol>
      </div>
    </ScrollTimelineContext.Provider>);
}
interface ScrollTimelineItemProps {
    title: React.ReactNode;
    date?: React.ReactNode;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
}
export function ScrollTimelineItem({ title, date, icon, children, className, }: ScrollTimelineItemProps) {
    const ctx = React.useContext(ScrollTimelineContext);
    const container = ctx?.container;
    const activationLine = ctx?.activationLine ?? 0.5;
    const isStatic = ctx?.isStatic ?? false;
    const itemRef = React.useRef<HTMLLIElement>(null);
    const { scrollYProgress } = useScroll({
        target: itemRef,
        container,
        offset: [`start ${activationLine + 0.06}`, `start ${activationLine - 0.06}`],
    });
    const [reached, setReached] = React.useState(false);
    useMotionValueEvent(scrollYProgress, "change", (v) => {
        const next = v >= 0.5;
        setReached((prev) => (prev === next ? prev : next));
    });
    const dotScale = useTransform(scrollYProgress, [0, 1], [0.55, 1]);
    const haloOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const haloScale = useTransform(scrollYProgress, [0, 1], [0.8, 2.1]);
    const contentOpacity = useTransform(scrollYProgress, [0, 1], [0.4, 1]);
    const contentY = useTransform(scrollYProgress, [0, 1], [8, 0]);
    const active = isStatic || reached;
    return (<li ref={itemRef} className={cn("relative pb-10 last:pb-0", className)} style={{ paddingLeft: RAIL_X + 28 }}>
      
      <motion.span aria-hidden className="pointer-events-none absolute top-1 size-4 rounded-full bg-neutral-900/15 blur-[3px] dark:bg-neutral-100/20" style={isStatic
            ? { left: RAIL_X, x: "-50%", opacity: 1, scale: 2.1 }
            : { left: RAIL_X, x: "-50%", opacity: haloOpacity, scale: haloScale }}/>
      
      <motion.span aria-hidden className={cn("absolute top-1 grid size-4 place-items-center rounded-full border transition-colors duration-300", active
            ? "border-blue-600 bg-blue-600 text-white dark:border-blue-400 dark:bg-blue-400 dark:text-neutral-900"
            : "border-neutral-300 bg-white text-transparent dark:border-neutral-700 dark:bg-neutral-950")} style={isStatic
            ? { left: RAIL_X, x: "-50%" }
            : { left: RAIL_X, x: "-50%", scale: dotScale }}>
        {icon ? (<span className="grid size-2.5 place-items-center [&>svg]:size-2.5">
            {icon}
          </span>) : null}
      </motion.span>
      
      <motion.div style={isStatic ? undefined : { opacity: contentOpacity, y: contentY }}>
        {date ? (<div className="text-xs font-medium tracking-wide text-neutral-400 tabular-nums dark:text-neutral-500">
            {date}
          </div>) : null}
        <div className={cn("mt-0.5 text-[20px] font-semibold transition-colors duration-300", active
            ? "text-black/70 dark:text-neutral-100"
            : "text-black/40 dark:text-neutral-400")}>
          {title}
        </div>
        {children ? (<div className="mt-1 text-sm leading-relaxed text-black/70 dark:text-neutral-300">
            {children}
          </div>) : null}
      </motion.div>
    </li>);
}
