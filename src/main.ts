import './style.css';
import htmlToCanvas from 'html2canvas';

//
// Interface Template
//

const template = `
	<main class="ns-preview">
		<img class="ns-image" hidden />
		<img class="ns-placeholder" src="${getAsset('framer-placeholder')}" />
		<img class="ns-overlay" src="${getAsset('framer-overlay')}" />
	</main>

	<form class="ns-upload">
		<label class="ns-button" for="ns-upload">Upload Your Photo&hellip;</label>
		<input id="ns-upload" type="file" accept="image/png, image/jpeg" hidden />
	</form>

	<form class="ns-download" hidden>
    <fieldset>
		  <p>Adjust the slider below to zoom; drag-and-drop to adjust position.</p>
		  <input class="ns-scale" type="range" min="100" max="200" step="1" value="100" />
    </fieldset>
		<button id="ns-download" type="button">Download Badge</button>
	</form>

  <div class="ns-success" hidden>
    <b>Your badge has been generated!</b> Please check your downloads folder.
  </div>
`;

//
// References
//

let app: HTMLDivElement;
let wrapper: HTMLElement;
let image: HTMLImageElement;
let uploadForm: HTMLFormElement;
let placeholder: HTMLImageElement;
let downloadForm: HTMLFormElement;
let scaleSlider: HTMLInputElement;
let uploadButton: HTMLInputElement;
let successMessage: HTMLDivElement;
let downloadButton: HTMLButtonElement;

//
// Initialization
//

document.addEventListener('DOMContentLoaded', function () {
  // Inject the app into the page body
  app = document.createElement('div');
  app.className = 'ns-framer';
  app.innerHTML = template;
  document.getElementById('ns-framer')?.appendChild(app);

  // Map element references
  wrapper = app.querySelector('main')!;
  image = app.querySelector('.ns-image')!;
  scaleSlider = app.querySelector('.ns-scale')!;
  uploadButton = app.querySelector('#ns-upload')!;
  uploadForm = app.querySelector('form.ns-upload')!;
  successMessage = app.querySelector('.ns-success')!;
  placeholder = app.querySelector('.ns-placeholder')!;
  downloadButton = app.querySelector('#ns-download')!;
  downloadForm = app.querySelector('form.ns-download')!;

  // Wire up event listeners
  document.addEventListener('mouseup', endDrag);
  image.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', onDrag);
  uploadButton.addEventListener('change', setImage);
  scaleSlider.addEventListener('input', scaleImage);
  downloadButton.addEventListener('click', downloadImage);
});

//
// Event Handlers
//

function setImage(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    image.src = e.target?.result as string;
    image.hidden = false;
    uploadForm.hidden = true;
    placeholder.hidden = true;
    downloadForm.hidden = false;
    wrapper.classList.remove('ns-preview');
  };

  reader.readAsDataURL(file);
}

function scaleImage(event: Event) {
  const scale = Number((event.target as HTMLInputElement).value);
  image.style.width = scale + '%';
}

function downloadImage() {
  const render = wrapper.cloneNode(true) as HTMLElement;
  const img = render.querySelector('.ns-image')! as HTMLImageElement;
  render.classList.remove('ns-preview');
  render.classList.add('ns-render');
  img.style.left = `${img.dataset.left}`;
  img.style.top = `${img.dataset.top}`;
  app.appendChild(render);

  htmlToCanvas(render).then(function (canvas) {
    const link = document.createElement('a');
    link.download = 'next-stage-badge.jpg';
    link.href = canvas.toDataURL('image/jpeg');
    link.click();

    render.remove();
    downloadForm.hidden = true;
    successMessage.hidden = false;
  });
}

// DRAG-AND-DROP
// Note: this is 95% vibe code. It's a miracle it works at all.

let startX = 0;
let startY = 0;
let offsetX = 0;
let offsetY = 0;
let dragging = false;

function startDrag(e: MouseEvent) {
  dragging = true;
  startX = e.clientX;
  startY = e.clientY;
  const rect = image.getBoundingClientRect();
  const containerRect = wrapper.getBoundingClientRect();
  offsetX = rect.left - containerRect.left;
  offsetY = rect.top - containerRect.top;
  image.classList.add('is-dragging');
}

function onDrag(e: MouseEvent) {
  if (!dragging) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  const newLeft = clamp(
    offsetX + dx,
    0,
    wrapper.clientWidth - image.clientWidth
  );
  const newTop = clamp(
    offsetY + dy,
    0,
    wrapper.clientHeight - image.clientHeight
  );

  image.style.left = `${newLeft}px`;
  image.style.top = `${newTop}px`;

  const multiplier = 1080 / wrapper.clientWidth;
  image.dataset.left = `${newLeft * multiplier}px`;
  image.dataset.top = `${newTop * multiplier}px`;
}

function endDrag() {
  dragging = false;
  image.classList.remove('is-dragging');
}

//
// Helpers
//

function getAsset(rel: string) {
  const link = document.querySelector(`link[rel="${rel}"]`);
  return link?.getAttribute('href');
}

function clamp(value: number, min: number, max: number) {
  return Math.min(min, Math.max(max, value));
}
