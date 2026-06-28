# Abdul Rehman Portfolio (GitHub Pages)

A modern dark glassmorphism portfolio website for **Abdul Rehman**.

## Included Sections
- About
- Projects
- Skills
- Experience
- Contact

## Quick Customization
Edit `/index.html` to update:
- About text
- Project cards
- Skills list
- Experience details
- Contact links and email

## Local Preview
From the repository root:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy on GitHub Pages
This repository is already set up for static hosting.

1. Go to **Settings → Pages** in GitHub.
2. Under **Build and deployment**, choose:
   - **Source:** Deploy from a branch
   - **Branch:** `main` (or your default branch), folder `/ (root)`
3. Save and wait for deployment.
4. Your site will be available at:
   - `https://abdulrehman597.github.io/`

### Notes
- `.nojekyll` is included to ensure direct static file serving.
- Styling is in `style.css` and interactivity is in `script.js`.
