# Next Stage Framer

## Installation

### Copy assets to your host

Copy `dist/index.js` and `dist/index.css` to your host. Rename as necessary to avoid conflict with other assets.

### Add references

Add `<link rel="stylesheet" src="index.css" />` and `<script type="module" src="index.css"></script>` to your `<head>` block. Remember to update the filenames if needed.

Add `<link rel="framer-overlay" href="..." />`. Set the `href` property to the URL for your overlay image (must be a 1080×1350px PNG).

Add `<link rel="framer-placeholder" href="..." />`. Set the `href` property to the URL for your placeholder image (must be a 1080×1350px image).

### Add Container

Add `<div id="ns-framer"></div>` to your `<body>`. The framer will be rendered within this container. The UI will expand to fit the width of this container; add `#ns-framer { max-width: 800px; }` to your stylesheet if your content well is wide.
