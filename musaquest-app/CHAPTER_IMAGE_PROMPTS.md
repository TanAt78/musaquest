# Chapter image prompts

Drop one of these into your favourite image generator (Midjourney, DALL·E,
Flux, Imagen, Leonardo, Freepik, Nano Banana, etc.) to produce the 12
chapter hero illustrations. They're built to match the home-page hero —
the warm Egyptian panorama you already have — so the whole app feels like
one illustrated book.

## Style anchor (use on every prompt)

```
Children's illustrated storybook scene, warm watercolor and gouache style,
soft golden-hour Egyptian light, painterly brushwork, gentle pastel
shadows, cinematic composition, no people, no figures, no faces, no text
overlays, no Arabic calligraphy in the image, symbolic objects only.
Color palette: cream sand, warm gold, deep teal, terracotta, soft blues.
Aspect ratio 16:10. High detail, kid-friendly, reverent atmosphere.
```

Append the per-chapter scene below to that anchor.

## Output spec

- **Aspect ratio:** 16:10 (or 1600×1000 if your tool wants pixels). The
  chapter page renders the image inside an `aspect-[16/10]` container with
  `object-cover`, so 16:10 fits perfectly.
- **Filename convention:** save each as `chapter-1.png`, `chapter-2.png`,
  …, `chapter-12.png`. Drop them in `musaquest-app/public/chapters/`.
- **In Supabase:** open Admin → each chapter → set **Hero Image URL** to
  `/chapters/chapter-1.png` (or wherever you uploaded). Or set the full
  Supabase Storage URL if you put them in a bucket. Save.

A note on the convention: **never depict the Prophets or any human face**.
All scenes are landscape / object compositions — basket, river, palace,
staff, sea, tablets, and so on. That's both Islamically respectful and
cleanly stylish.

---

## Chapter 1 — The River Cradle

> A woven reed basket floating on a calm Nile at golden hour. The basket
> is gently illuminated, lined with soft white cloth. Lotus pads and
> reeds float beside it. The far bank shows a hint of palace columns in
> warm honeyed light. Dragonflies skim the water. No people.

## Chapter 2 — The Palace Walls

> The interior courtyard of an ornate Egyptian palace at midday — golden
> sandstone columns with hieroglyphic carvings, palm trees in clay
> planters, a still reflecting pool, a single empty embroidered cradle
> on a low marble dais wrapped in deep teal silk. Light falls through
> latticed windows. No people.

## Chapter 3 — The Journey to Midian

> A long, winding desert path through warm dunes at sunset. A single
> set of footprints leads toward distant mountains. A weathered traveller's
> staff is planted in the sand by the path. A solitary palm tree stands
> against the sky. Soft glow on the horizon. No people.

## Chapter 4 — The Years in Midian

> A stone well at the edge of an oasis village in late afternoon. A wooden
> bucket sits on the well's rim. Beside it, two small clay water pitchers.
> A flock of sheep grazes nearby in the soft shade of a tamarind tree.
> Stone houses with flat roofs are visible in the distance. No people.

## Chapter 5 — The Burning Tree

> A small bushy tree on a sacred hillside, its leaves glowing with a
> warm golden inner fire — flames that illuminate but do not consume.
> The valley around it is bathed in dusk blues and silvers. A few
> wildflowers grow at its base. The light from the tree casts a soft
> aura on the surrounding rocks. Reverent, awe-inspiring, calm.
> No people.

## Chapter 6 — The Staff and the Mission

> A simple wooden shepherd's staff lying on a flat sun-warmed rock in
> a sacred valley. The staff is carved with subtle grain. A faint
> golden aura surrounds it. The light is dramatic, low-angle, with
> long shadows. The horizon shows distant mountains. No people, no
> snake imagery (keep symbolic).

## Chapter 7 — Confronting Pharaoh

> The grand throne room of Pharaoh seen from the entryway — towering
> sandstone columns, hieroglyphs in deep ochre and turquoise, an empty
> ornate gilded throne raised on tiered steps, two great stone statues
> flanking it. Shafts of warm light from clerestory windows cut through
> the dust. Quiet, monumental, not menacing. No people.

## Chapter 8 — The Magicians Believe

> A wide outdoor plaza in front of an Egyptian palace. On the polished
> stone floor, several discarded ropes and wooden staffs lie scattered,
> as if just dropped. A single staff stands upright in the centre, taller
> than the others, gently glowing. The crowd has gone — only the objects
> remain. Long sunset shadows stretch across the stone. No people.

## Chapter 9 — The Signs Upon Egypt

> A dramatic sky over Egyptian fields — towering golden-edged storm
> clouds piling up, swallows scattering. Below, dry cracked earth meets
> a row of withered palm trees. Distant pyramids on the horizon. A few
> droplets begin to fall. Mood is solemn, not frightening. Warm-toned
> palette even within the storm. No people.

## Chapter 10 — The Sea Opens

> Two great walls of clear blue-turquoise water rise on either side of a
> dry sandy path lit by golden sunset light. Tiny shells and pebbles
> on the path. Schools of small fish suspended in the water walls. The
> path leads toward a distant coastal shore. Awe-inspiring scale, soft
> watercolor edges. No people.

## Chapter 11 — The Tablets of Guidance

> Two stone tablets with rounded tops, carved with simple ornamental
> spiral patterns (no readable text or letters), resting on a flat
> mountaintop altar of weathered rock. Soft warm light pours from
> above. Cumulus clouds frame the scene. A single bird circles
> overhead. Sacred, calm, hopeful. No people.

## Chapter 12 — The Wilderness Lessons

> A wide desert plain at dawn. Above, a low, soft cloud trails across
> the sky like a canopy of shade, casting cool shadows on the warm
> golden sand below. A small pile of round, perfect manna-like food
> sits on a flat stone in the foreground. Distant mountains on the
> horizon. Gentle, providing, peaceful. No people.

---

## Workflow

1. Generate one chapter at a time so you can iterate on each. Don't try
   to batch — consistency matters more than throughput.
2. Save each as `chapter-N.png`.
3. Upload to `musaquest-app/public/chapters/` (and commit + push), **or**
   to Supabase Storage if you want to swap them without redeploying.
4. In `/admin/chapter/N`, paste the URL into "Hero Image URL" and save.
   The chapter page picks it up immediately; the home Continue Reading
   card picks it up too because it reads `hero_image_url` from the same
   row.
5. The home hero (the panorama) stays — chapter heroes are individual.

If you want me to bias prompts toward a different art direction (more
abstract, more minimalist, manga-inspired, oil painting, papercut), say
the word and I'll rewrite.
