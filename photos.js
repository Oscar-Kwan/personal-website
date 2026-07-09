// ── Your photos ──────────────────────────────────────────────────
// Drop image files into the photos/ folder, then list them below.
// Include w/h so the layout renders instantly without downloading images first.
const PHOTOS = [
  { src: "photos/10_48570028.jpeg", w: 2000, h: 1326 },
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
  { src: "photos/IMG_4684.JPG", w: 2000, h: 1333 },
  { src: "photos/IMG_4686.JPG", w: 2000, h: 1333 },
  { src: "photos/IMG_4689.JPG", w: 2000, h: 1333 },
  { src: "photos/IMG_4694.JPG", w: 2000, h: 1333 },
  { src: "photos/IMG_4697.JPG", w: 2000, h: 1333 },
  { src: "photos/IMG_4760.JPG", w: 2000, h: 1333 },
  { src: "photos/IMG_4982.JPG", w: 2000, h: 1333 },
  { src: "photos/IMG_4983.JPG", w: 2000, h: 1333 },
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

const ROW_HEIGHT = 260;
const GAP = 10;
const MAX_PER_ROW = 3;

const galleryEl = document.getElementById("gallery");
const emptyEl = document.getElementById("galleryEmpty");

const items = PHOTOS.map((p, i) => {
  const data = typeof p === "string" ? { src: p } : p;
  return { ...data, index: i, ar: data.w / data.h };
});

if (!items.length) emptyEl.hidden = false;

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        delete img.dataset.src;
      }
      io.unobserve(img);
    });
  },
  { rootMargin: "400px 0px" }
);

function isPortrait(photo) {
  return photo.ar < 1;
}

function rowWidthAtHeight(row, height = ROW_HEIGHT) {
  if (!row.length) return 0;
  const gaps = (row.length - 1) * GAP;
  return row.reduce((sum, photo) => sum + photo.ar * height, 0) + gaps;
}

function isLandscapePortraitPair(row) {
  return row.length === 2 && isPortrait(row[0]) !== isPortrait(row[1]);
}

function shouldEndRow(row, containerWidth) {
  if (row.length >= MAX_PER_ROW) return true;
  if (rowWidthAtHeight(row) >= containerWidth) return true;
  if (isLandscapePortraitPair(row)) return true;
  return false;
}

function buildRows(photos, containerWidth) {
  const rows = [];
  let index = 0;

  while (index < photos.length) {
    const row = [photos[index++]];

    while (index < photos.length && row.length < MAX_PER_ROW) {
      const next = photos[index];
      const candidate = [...row, next];

      if (rowWidthAtHeight(candidate) > containerWidth) break;

      row.push(next);
      index++;

      if (shouldEndRow(row, containerWidth)) break;
    }

    rows.push({ photos: row, justify: false });
  }

  for (let i = 0; i < rows.length - 1; i++) rows[i].justify = true;

  return rows;
}

function createTile(photo, width, height) {
  const fig = document.createElement("button");
  fig.className = "gallery-item";
  fig.type = "button";
  fig.style.width = width + "px";
  fig.style.height = height + "px";
  fig.setAttribute("aria-label", photo.caption || "Open photo");

  const img = document.createElement("img");
  img.className = "gallery-img";
  img.alt = photo.caption || "";
  img.decoding = "async";
  img.loading = "lazy";
  img.dataset.src = photo.src;
  img.addEventListener("load", () => fig.classList.add("is-loaded"));
  img.addEventListener("error", () => fig.remove());

  fig.append(img);
  fig.addEventListener("click", () => openLightbox(photo.index));
  io.observe(img);
  return fig;
}

function renderGallery(photos) {
  const width = galleryEl.clientWidth;
  if (!width || !photos.length) return;

  galleryEl.innerHTML = "";
  const rows = buildRows(photos, width);

  rows.forEach(({ photos: rowPhotos, justify }) => {
    const rowEl = document.createElement("div");
    rowEl.className = "gallery-row";

    const gaps = (rowPhotos.length - 1) * GAP;
    const totalAr = rowPhotos.reduce((sum, p) => sum + p.ar, 0);
    const rowHeight = justify ? (width - gaps) / totalAr : ROW_HEIGHT;

    rowPhotos.forEach((photo) => {
      const itemWidth = photo.ar * rowHeight;
      rowEl.appendChild(createTile(photo, itemWidth, rowHeight));
    });

    galleryEl.appendChild(rowEl);
  });
}

renderGallery(items);

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => renderGallery(items), 150);
});

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
