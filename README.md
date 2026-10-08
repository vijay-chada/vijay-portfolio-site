# Vijay Krishna Reddy — Portfolio

A responsive, single-page portfolio built with semantic HTML5, custom CSS, Tailwind CSS via CDN, and vanilla JavaScript. No build step or package installation is needed.

## Run locally

1. Open this folder in VS Code.
2. Open the integrated terminal and run:

   ```powershell
   py -m http.server 8000
   ```

3. Visit [http://localhost:8000](http://localhost:8000) in your browser. Stop the server with `Ctrl+C`.

An internet connection is needed for Google Fonts, Font Awesome, Tailwind CSS CDN, and the Unsplash project images.

## Personalize

- **Name and copy:** Update the hero, About, testimonials, contact, page title, and footer in `index.html`.
- **Photo:** Add your image to this folder and name it `profile.jpg`. The hero and About sections both use this file.
- **Email, phone, and location:** Replace `YOUR_EMAIL`, `YOUR_PHONE`, and `YOUR_CITY` in the Contact section. Update the matching `mailto:` and `tel:` links as needed.
- **Projects:** Edit project titles, descriptions, technology tags, Unsplash image URLs, and GitHub/live-project links in the Projects section of `index.html`.
- **Resume:** Add your CV as `assets/vijay-krishna-reddy-cv.pdf`, or change the Download CV link.
- **Social profiles:** Replace the sample GitHub, LinkedIn, Dribbble, and X profile links.
- **Contact form:** Client-side validation and a confirmation toast are included. The form needs a backend or form service to deliver submissions.
- **Styles and behavior:** Edit `style.css` for appearance and responsive breakpoints; `script.js` handles theme persistence, navigation, animation, counters, and form validation.

Tailwind's CDN is convenient for development. For production, consider compiling Tailwind into a local stylesheet.
