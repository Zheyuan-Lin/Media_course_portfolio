# ENG328 Website

Static website for ENGRD 328W course archive content.

## Requirements

- Python 3 (for local static server)

## Run Locally

1. Open Terminal.
2. Go to the project folder:

```bash
cd "/Users/soukasumi/Desktop/ENG328-website"
```

3. Start a local server:

```bash
python3 -m http.server 8000
```

4. Open in browser:

- [http://localhost:8000/index.html](http://localhost:8000/index.html)

5. Stop server with `Ctrl + C`.

## Project Files

- `index.html`: Main static page and rendering logic.
- `data.js`: Content source (`window.COURSE_DATA`) for students, papers, gallery, citations.
- `assets/gallery/`: Gallery images used by the site.
- `gallery-image-sizes.md`: Image dimensions/aspect-ratio reference.

## Updating Content

- Edit `data.js` for:
  - `students`
  - `papers`
  - `gallery`
  - `citations`

## Common Issues

- **Images not loading (404)**:
  - Confirm image paths exist under `assets/gallery/`.
  - Confirm `data.js` `gallery[].loc` matches file names exactly (including spaces/case).
- **Changes not appearing**:
  - Hard refresh browser (`Cmd + Shift + R` on macOS).

