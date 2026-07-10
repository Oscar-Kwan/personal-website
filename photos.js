// ── Your photos ──────────────────────────────────────────────────
// Drop image files into the photos/ folder, then list them below.
// Include w/h so tiles reserve space before images load.
const PHOTOS = [
  { src: "photos/10_48570028.jpeg", w: 2000, h: 1326 },
  { src: "photos/DSCF2009.JPG", w: 2000, h: 1333 },
  { src: "photos/DSCF2269.JPG", w: 2000, h: 1333 },
  { src: "photos/DSCF2278.JPG", w: 2000, h: 1333 },
  { src: "photos/DSCF2505.JPG", w: 1333, h: 2000 },
  { src: "photos/DSCF2547.JPG", w: 2000, h: 1333 },
  { src: "photos/DSCF2647.JPG", w: 2000, h: 1333 },
  { src: "photos/DSCF2690.JPG", w: 2000, h: 1333 },
  { src: "photos/img20241210_04584880.jpg", w: 1245, h: 2000 },
  { src: "photos/IMG_0423.JPG", w: 2000, h: 1325 },
  { src: "photos/IMG_0430.JPG", w: 2000, h: 1325 },
  { src: "photos/IMG_1596.JPG", w: 1326, h: 2000 },
  { src: "photos/IMG_1600.JPG", w: 2000, h: 1326 },
  { src: "photos/IMG_1617.JPG", w: 2000, h: 1326 },
  { src: "photos/IMG_1621.JPG", w: 2000, h: 1326 },
  { src: "photos/IMG_1624.JPG", w: 2000, h: 1326 },
  { src: "photos/IMG_3275.JPG", w: 2000, h: 1326 },
  { src: "photos/IMG_4421.JPG", w: 2000, h: 1333 },
  { src: "photos/IMG_4422.JPG", w: 2000, h: 1333 },
  { src: "photos/IMG_4464.JPG", w: 2000, h: 1333 },
  { src: "photos/IMG_4465.JPG", w: 2000, h: 1333 },
  { src: "photos/IMG_4466.JPG", w: 2000, h: 1333 },
  { src: "photos/IMG_4686.JPG", w: 2000, h: 1333 },
  { src: "photos/IMG_4689.JPG", w: 2000, h: 1333 },
  { src: "photos/IMG_4694.JPG", w: 2000, h: 1333 },
  { src: "photos/IMG_4697.JPG", w: 2000, h: 1333 },
  { src: "photos/IMG_4760.JPG", w: 2000, h: 1333 },
  { src: "photos/IMG_4982.JPG", w: 2000, h: 1333 },
  { src: "photos/IMG_4988.JPG", w: 2000, h: 1333 },
  { src: "photos/IMG_4994.JPG", w: 2000, h: 1333 },
  { src: "photos/IMG_5139.JPG", w: 2000, h: 1333 },
  { src: "photos/IMG_5144.JPG", w: 2000, h: 1333 },
  { src: "photos/IMG_5147.JPG", w: 2000, h: 1333 },
  { src: "photos/IMG_6262.JPG", w: 2000, h: 1333 },
  { src: "photos/IMG_6268.JPG", w: 2000, h: 1333 },
  { src: "photos/IMG_6269.JPG", w: 2000, h: 1333 },
  { src: "photos/IMG_6485.JPG", w: 2000, h: 1333 },
  { src: "photos/IMG_7891.JPG", w: 2000, h: 1325 },
  { src: "photos/IMG_8551.JPG", w: 2000, h: 1333 },
];

const galleryEl = document.getElementById("gallery");
const emptyEl = document.getElementById("galleryEmpty");

const items = PHOTOS.map((p, i) => {
  const data = typeof p === "string" ? { src: p } : p;
  return { ...data, index: i, ar: data.w / data.h };
});

if (!items.length) emptyEl.hidden = false;

let revealIndex = 0;

const revealIo = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const tile = entry.target;
      const delay = (revealIndex++ % 5) * 70;
      tile.style.setProperty("--reveal-delay", delay + "ms");
      tile.classList.add("is-visible");

      const img = tile.querySelector("img");
      if (img?.dataset.src) {
        img.src = img.dataset.src;
        delete img.dataset.src;
      }

      revealIo.unobserve(tile);
    });
  },
  { rootMargin: "250px 0px", threshold: 0.05 }
);

function createTile(photo) {
  const fig = document.createElement("button");
  fig.className = "gallery-item is-pending";
  fig.type = "button";
  fig.style.setProperty("--ar", String(photo.ar));
  fig.setAttribute("aria-label", photo.caption || "Open photo");

  const img = document.createElement("img");
  img.className = "gallery-img";
  img.alt = photo.caption || "";
  img.decoding = "async";
  img.dataset.src = photo.src;
  img.addEventListener("load", () => {
    fig.classList.remove("is-pending");
    fig.classList.add("is-loaded");
  });
  img.addEventListener("error", () => fig.remove());

  fig.append(img);
  fig.addEventListener("click", () => openLightbox(photo.index));
  revealIo.observe(fig);
  return fig;
}

function renderGallery(photos) {
  galleryEl.innerHTML = "";
  revealIndex = 0;
  photos.forEach((photo) => galleryEl.appendChild(createTile(photo)));
}

renderGallery(items);

const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCaption = document.getElementById("lbCaption");
let current = 0;

function render() {
  const item = items[current];
  lbImg.src = item.src;
  lbImg.alt = item.caption || "";
  lbCaption.textContent = item.caption || "";
  lbCaption.hidden = !item.caption;
}

function openLightbox(i) {
  current = i;
  render();
  lb.classList.add("is-open");
  lb.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lb.classList.remove("is-open");
  lb.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function next() {
  current = (current + 1) % items.length;
  render();
}

function prev() {
  current = (current - 1 + items.length) % items.length;
  render();
}

document.getElementById("lbClose").addEventListener("click", closeLightbox);
document.getElementById("lbNext").addEventListener("click", next);
document.getElementById("lbPrev").addEventListener("click", prev);
lb.addEventListener("click", (e) => {
  if (e.target === lb) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (!lb.classList.contains("is-open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") next();
  if (e.key === "ArrowLeft") prev();
});
