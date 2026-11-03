import { ScrollTrigger } from "gsap/ScrollTrigger";

import { gsap } from "./gsap";

/*
 * ScrollTrigger, registered on the shared core so `gsap.defaults()` still
 * applies. Import from here rather than from `./gsap` whenever a component
 * uses ScrollTrigger, INCLUDING when it only passes a `scrollTrigger:` object
 * to a tween and never names the class: that form needs the plugin registered
 * just as much, and eight components were relying on a registration they never
 * imported. See lib/gsap.ts and #353.
 */
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
