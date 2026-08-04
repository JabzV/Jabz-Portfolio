"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Single registration point for GSAP plugins.
 *
 * ES modules are evaluated once per bundle, so importing `gsap`/`ScrollTrigger`
 * from here guarantees `registerPlugin` runs exactly once no matter how many
 * motion components mount. Registering per-component is the usual source of
 * duplicate-registration warnings.
 *
 * `useGSAP` is registered too — it is a no-op plugin whose only job is to keep
 * bundlers from tree-shaking the hook's GSAP linkage.
 */
gsap.registerPlugin(useGSAP, ScrollTrigger);

export { gsap, ScrollTrigger, useGSAP };
