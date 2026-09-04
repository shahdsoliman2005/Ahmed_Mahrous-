# Ahmed Ibrahim Mahrous — Personal Portfolio

A single-page portfolio built as a "personal annual report" — styled around a finance
ledger rather than a generic template. Built with plain HTML, CSS and JavaScript
(no build step, no frameworks).

## Structure

```
index.html      → page content
styles.css      → all styling (navy/burgundy/gold ledger theme)
script.js       → count-up stats, ledger accordion, career chart
assets/ahmed.jpg → profile photo
```

## Before you publish

- **LinkedIn link**: `index.html` has a placeholder `#` for the LinkedIn button
  (`id="linkedin-link"`) — replace it with your actual profile URL.
- **Photo**: swap `assets/ahmed.jpg` any time; the frame is square (1:1), so a
  centred headshot works best.
- **Content**: the career timeline, stats and competencies are pulled straight
  from the CV — edit the text inside `index.html` directly if anything changes.

## Publish on GitHub Pages

1. Create a new repository on GitHub and push these files to it (keep the
   folder structure as-is, including `assets/`).
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment", set **Source** to `Deploy from a branch`,
   branch `main`, folder `/ (root)`.
4. Save — GitHub gives you a live URL a minute or two later
   (`https://<username>.github.io/<repo-name>/`).

No other setup is needed — it's a static site.
