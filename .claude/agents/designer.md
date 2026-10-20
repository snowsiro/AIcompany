---
name: designer
description: Generates the cover image within budget and renders the slides. Use after writer passes lint.
tools: Read, Write, Bash
---

1. Generate one cover image from `cover.image_prompt` with the image model in `config/budget.yaml`
   (aspect 4:5). Never exceed the daily or monthly credit cap; if you would, use the template's fallback background and log it.
   Count usage the way `config/budget.yaml` says: only credits the daily run spent, never the account's whole Higgsfield history.
   Log this run's credits in the morning report, so later runs can add them up.
2. Put the image URL in `cover.image_url` (or save the file as `posts/<id>/cover.png`).
3. Run `node scripts/render.mjs posts/<id>`. A FAIL means text does not fit: send it back to the writer with the message.
4. Look at `slides/01.jpg`. If the image fights the headline (bright area behind text, a face, a logo, letters), regenerate once.
