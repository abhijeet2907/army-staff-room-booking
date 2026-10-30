const menuToggle = document.querySelector("#menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const photoGallery = document.querySelector("#photo-gallery");
const previousPhotosButton = document.querySelector("#gallery-previous");
const nextPhotosButton = document.querySelector("#gallery-next");
const galleryPosition = document.querySelector("#gallery-position");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("navigation-open", !isOpen);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("navigation-open");
  });
});

document.querySelector("#current-year").textContent = String(new Date().getFullYear());

function updateGalleryControls() {
  const firstCard = photoGallery.querySelector(".gallery-card");
  if (!firstCard) return;

  const styles = getComputedStyle(photoGallery);
  const gap = Number.parseFloat(styles.columnGap) || 0;
  const stride = firstCard.getBoundingClientRect().width + gap;
  const visibleCards = Math.max(1, Math.round((photoGallery.clientWidth + gap) / stride));
  const maxScroll = photoGallery.scrollWidth - photoGallery.clientWidth;
  const currentIndex = Math.min(
    photoGallery.children.length,
    Math.floor((photoGallery.scrollLeft + 1) / stride) + 1,
  );
  const lastPageStart = Math.max(0, photoGallery.children.length - visibleCards);

  galleryPosition.textContent = `${String(currentIndex).padStart(2, "0")} / ${String(photoGallery.children.length).padStart(2, "0")}`;
  previousPhotosButton.disabled = photoGallery.scrollLeft <= 1;
  nextPhotosButton.disabled = photoGallery.scrollLeft >= maxScroll - 1;

  return { stride, visibleCards, lastPageStart };
}

function moveGallery(direction) {
  const gallery = updateGalleryControls();
  if (!gallery) return;

  const targetIndex = Math.min(
    gallery.lastPageStart,
    Math.max(0, Math.round(photoGallery.scrollLeft / gallery.stride) + direction * gallery.visibleCards),
  );
  photoGallery.scrollTo({
    left: targetIndex * gallery.stride,
    behavior: "smooth",
  });
}

previousPhotosButton.addEventListener("click", () => moveGallery(-1));
nextPhotosButton.addEventListener("click", () => moveGallery(1));
photoGallery.addEventListener("scroll", updateGalleryControls, { passive: true });
window.addEventListener("resize", updateGalleryControls);
updateGalleryControls();
