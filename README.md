# MusaQuest Prototype

A 4-page clickable prototype for **MusaQuest**, an Islamic gamified storytelling app for kids. Built with the design system from your Stitch project (`projects/3101205470159315527`).

## Pages

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | The Traveler dashboard. Rank, Up Next, quests, journey grid. |
| Chapter Reader | `chapter.html` | "The Journey to Midian" full reading experience with Arabic verse, audio bar, reflection prompt. |
| Story Library | `stories.html` | All 12 Musa chapters (completed/current/locked) plus upcoming Prophet stories. |
| Profile | `profile.html` | Rank ladder (Seeker → Pilgrim), recent activity feed, badge grid. |

All pages share the same top app bar, bottom mobile nav, and design tokens (warm cream, deep teal, golden accents, Literata + Nunito Sans + Amiri).

## Click flows wired

- Home rank card → Profile
- Home "Continue Reading" → Chapter Reader
- Home "View All" / chapter cards → Story Library
- Story Library cards → Chapter Reader
- Chapter Reader "All Stories" → Story Library
- Chapter Reader "Mark Complete" → Home
- Top nav + bottom nav: Home, Stories, Profile all wired
- "Verses" and "Reflect" nav items are intentionally placeholders (#) for the prototype

## Deploy to Netlify

You have three paths from fastest to most controllable.

### Option 1: Drag and drop (60 seconds, no account setup needed)

1. Go to https://app.netlify.com/drop
2. Drag this whole folder (the one containing `index.html`) onto the drop zone
3. Done. You get a URL like `https://random-name-123456.netlify.app`
4. Click "Site settings" to rename it to something like `musaquest-preview`

### Option 2: Netlify CLI (best for iterating)

```bash
# One-time install
npm install -g netlify-cli
netlify login

# From inside the site folder
cd /path/to/musaquest-prototype
netlify deploy --dir=. --prod

# Or for a draft URL first to check before going live
netlify deploy --dir=.
```

### Option 3: Git deploy (best for ongoing edits)

1. `git init` in this folder, commit, push to a new GitHub repo (private is fine)
2. In Netlify: Add new site → Import from Git → pick the repo
3. Build settings: leave blank (no build needed, it's static)
4. Deploy. Every git push redeploys automatically.

## What this prototype is and isn't

**It IS:**
- A high-fidelity click-through demo
- Production-quality visual design matching your Stitch source
- Mobile-responsive (try resizing the browser, or use it on your phone)
- A real share-able URL you can send to investors, content partners, or test parents
- Self-contained: no backend, no build step, no dependencies beyond CDN-loaded Tailwind and Google Fonts

**It is NOT:**
- A working app. Tap "Continue Reading" twice and you'll always land on the same Midian chapter.
- Stateful. XP, level, completed chapters, badges are all hardcoded mock data.
- A content management system. The Midian story text is hardcoded into chapter.html.
- Audio-enabled. The play button toggles its icon but no audio loads.
- Authenticated. There are no user accounts.

## What to do next, in order of effort

| If you want to... | Do this |
|---|---|
| Validate audience before building anything else | Run paid ads to a Bubble Girl-style audience pointing at this prototype, see if anyone clicks through more than 2 pages |
| Add real audio narration | Use ElevenLabs (you have it) to narrate "The Journey to Midian", drop the .mp3 next to chapter.html, swap the audio player to use a real `<audio>` element |
| Add a waitlist | Paste a Mailchimp / ConvertKit / Tally embed onto the home page below the rank card, or use Netlify's built-in form handling (free) |
| Make the chapters real | Convert this to Next.js with Supabase. Each chapter becomes a row in a `chapters` table. Auth tracks which chapters a user has read. ~3 weeks of work. |
| Find content partners before building | Send the prototype URL to Yaqeen Institute, One4Kids, Sunni School, Muslim Kids TV - "Would you license this format?" |

## Edit anything

- All HTML is hand-written and inline. No build step.
- To change the Midian story text: open `chapter.html`, search for "After everything that had happened"
- To change colors: each file has the same Tailwind config in `<script>tailwind.config = {...}</script>`. Change one, change all.
- To swap illustrations: search for `lh3.googleusercontent.com` URLs, replace with your own (Stitch's CDN may not be permanent - download these locally if you want to be safe).

## Image durability warning

The hero illustration of the desert ruins is hosted on Google's CDN (`lh3.googleusercontent.com`), pulled from the Stitch project. If that URL ever 404s, the chapter and home pages will show broken images. If you're going to keep this live for more than a few weeks, download those images locally and update the `src=` attributes.
