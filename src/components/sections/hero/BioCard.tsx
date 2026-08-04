import Image from "next/image";
import Link from "next/link";

import { bio } from "@/data/site";

/**
 * The BIO card (Figma `15:2555`, 265×228 at 1175,573 — flush to the hero's
 * bottom-right corner). The one light-on-dark element in the design.
 *
 * This is the single genuinely self-contained box in the hero: a fixed 265×228
 * frame whose parts are hairline boxes and label bars pinned to card-local
 * coordinates. Absolute positioning inside it is reproduction, not layout — the
 * card keeps its intrinsic size at every breakpoint (265px fits a 320px viewport
 * inside the shell gutter), so nothing here reflows.
 */
export function BioCard() {
  return (
    <article
      aria-labelledby="bio-heading"
      className="bg-fg text-fg-inverse font-body relative h-[228px] w-[265px] shrink-0"
    >
      {/* Inner hairline outline (14:8) */}
      <div className="border-fg-inverse absolute top-[11px] left-[13px] h-[205px] w-[244px] border" />

      {/* Black label bar (16:4302) + the name that sits on it (16:4300) */}
      <div className="bg-fg-inverse absolute top-[53px] left-[13px] h-[28px] w-[163px]" />
      <p className="text-nav text-fg absolute top-[53px] left-[21px] font-semibold">{bio.name}</p>

      <h2 id="bio-heading" className="text-nav absolute top-[18px] left-[23px] font-semibold">
        {bio.heading}
      </h2>

      {/* Arrow-outward chip (16:4320) + "About Me" (16:4318) as one target.
          The design draws them 24px apart at y 20 and 22; centred here (2px).
          `bio.cta.href` is null (U6 — no destination designed), so this renders
          as a button; an <a> without href is unreachable by keyboard. */}
      <button
        type="button"
        className="absolute top-[20px] left-[161px] flex items-center transition-opacity hover:opacity-70"
      >
        <span className="bg-fg grid size-6 shrink-0 place-items-center overflow-hidden">
          <Image
            src="/assets/hero/icon-arrow-outward.svg"
            alt=""
            width={12}
            height={12}
            className="size-3"
          />
        </span>
        <span className="text-body">{bio.cta.label}</span>
      </button>

      {/* Year box (16:4305) */}
      <div className="border-fg-inverse absolute top-[53px] left-[176px] h-[28px] w-[81px] border" />
      <p className="text-body absolute top-[57px] left-[202px]">{bio.year}</p>
      {/* 8px in Figma — raised to the 10px microlabel token (approved deviation) */}
      <p className="text-microlabel absolute top-[81px] left-[197px]">{bio.yearLabel}</p>

      {/* Education box (16:4308) */}
      <div className="border-fg-inverse absolute top-[102px] left-[13px] h-[42px] w-[244px] border" />
      <p className="text-body absolute top-[104px] left-[21px]">{bio.degree}</p>
      <p className="text-body absolute top-[123px] left-[21px]">{bio.honors}</p>

      <p className="text-body absolute top-[161px] left-[60px]">
        <span className="font-semibold">{bio.locationLabel}</span>: {bio.location}
      </p>
      <p className="text-body absolute top-[186px] left-[29px]">{bio.email}</p>
    </article>
  );
}
