/* Home Split Text — gracefully skip the decorative animation if the CDN is unavailable */
if (window.anime && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const { animate, text, stagger } = window.anime;
  const professionOne = document.querySelector(".home__profession-1");
  const professionTwo = document.querySelector(".home__profession-2");

  if (professionOne && professionTwo && text && animate && stagger) {
    const { chars: chars1 } = text.split(".home__profession-1", { chars: true });
    const { chars: chars2 } = text.split(".home__profession-2", { chars: true });

    animate(chars1, {
      y: [{ to: ["100%", "0%"] }, { to: "-100%", delay: 4000, ease: "in(3)" }],
      duration: 700,
      ease: "out(3)",
      delay: stagger(60),
      loop: true,
    });

    animate(chars2, {
      y: [{ to: ["100%", "0%"] }, { to: "-100%", delay: 4000, ease: "in(3)" }],
      duration: 700,
      ease: "out(3)",
      delay: stagger(60),
      loop: true,
    });
  }
}

/* Projects carousel: touch/drag + buttons + gentle autoplay; pauses on interaction/hover. */
if (window.Swiper && document.querySelector(".projects__swiper")) {
  const projectsSwiper = new Swiper(".projects__swiper", {
    loop: true,
    spaceBetween: 24,
    slidesPerView: "auto",
    grabCursor: true,
    simulateTouch: true,
    allowTouchMove: true,
    touchStartPreventDefault: false,
    watchOverflow: false,
    speed: 650,
    keyboard: { enabled: true, onlyInViewport: true },
    pagination: { el: ".swiper-pagination", clickable: true },
    navigation: { nextEl: ".projects__next", prevEl: ".projects__prev" },
    autoplay: { delay: 3200, disableOnInteraction: false, pauseOnMouseEnter: true, waitForTransition: true },
    breakpoints: { 768: { spaceBetween: 28 } },
  });
  // Avoid movement when the browser asks for reduced motion.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) projectsSwiper.autoplay.stop();
}

/* Work Tabs */
const tabs = document.querySelectorAll("[data-target]"),
  tabContents = document.querySelectorAll("[data-content]");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const targetSelector = tab.dataset.target,
      targetContent = document.querySelector(targetSelector);

    // Disable all content and active tabs
    tabContents.forEach((content) => content.classList.remove("work-active"));
    tabs.forEach((t) => t.classList.remove("work-active"));

    // Active the tab and corresponding content
    tab.classList.add("work-active");
    targetContent.classList.add("work-active");
  });
});

/* Services */
const buttons = document.querySelectorAll(".services__button");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const cards = document.querySelectorAll(".services__card");
    const card = button.closest(".services__card");
    const info = card.querySelector(".services__info");

    const isOpen = card.classList.contains("services__open");

    // Close all cards first
    cards.forEach((c) => {
      c.classList.remove("services__open");
      c.classList.add("services__close");

      const i = c.querySelector(".services__info");
      i.style.height = "0px";
    });

    // Open the clicked card
    if (!isOpen) {
      info.style.height = "auto";
      let height = info.scrollHeight + "px";

      card.classList.remove("services__close");
      card.classList.add("services__open");

      info.style.height = height;
    }
  });
});

/* Testimonials of Duplicate Cards */
// Duplicate images to make the animation work
const tracks = document.querySelectorAll(".testimonials__content");

tracks.forEach((track) => {
  const cards = [...track.children]; // spread to make a static copy

  // Duplicate cards only once
  for (const card of cards) {
    track.appendChild(card.cloneNode(true));
  }
});

/* Copy Email In Contact */
const copyBtn = document.getElementById("contact-btn");
const copyEmailElement = document.getElementById("contact-email");
const copyEmail = copyEmailElement ? copyEmailElement.textContent.trim() : "";

if (copyBtn && copyEmail) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(copyEmail);
      copyBtn.innerHTML = 'Email Copied <i class="ri-check-line"></i>';
      window.setTimeout(() => {
        copyBtn.innerHTML = 'Copy email <i class="ri-file-copy-line"></i>';
      }, 2000);
    } catch (error) {
      window.location.href = `mailto:${copyEmail}`;
    }
  });
}

/* Current Year of Footer */
const textYear = document.getElementById("footer-year");
if (textYear) textYear.textContent = new Date().getFullYear();

/* Scroll Section Active Link */
const sections = document.querySelectorAll("section[id]");

const scrollActive = () => {
  // We get the position by scrolling down
  const scrollY = window.scrollY;

  sections.forEach((section) => {
    const id = section.id, //id of each section
      top = section.offsetTop - 50, // Distance from the top edge
      height = section.offsetHeight, //Element height
      link = document.querySelector(".nav__menu a[href*=" + id + "]"); //id nav link

    if (!link) return;
    link.classList.toggle(
      "active-link",
      scrollY > top && scrollY <= top + height
    );
  });
};
// Throttle active-section updates to one paint per frame.
let activeScrollFrame = 0;
window.addEventListener("scroll", () => {
  if (activeScrollFrame) return;
  activeScrollFrame = window.requestAnimationFrame(() => {
    scrollActive();
    activeScrollFrame = 0;
  });
}, { passive: true });

/* Custom Cursor — update only when the pointer moves (no permanent animation loop) */
const cursor = document.querySelector(".cursor");
const finePointer = window.matchMedia("(pointer: fine)").matches;

if (cursor && finePointer) {
  // Animate with transform instead of left/top to avoid layout recalculation.
  document.addEventListener("pointermove", (event) => {
    cursor.style.transform = `translate3d(${event.clientX - 25}px, ${event.clientY - 25}px, 0)`;
  }, { passive: true });

  document.querySelectorAll("a, button").forEach((item) => {
    item.addEventListener("pointerenter", () => cursor.classList.add("hide-cursor"));
    item.addEventListener("pointerleave", () => cursor.classList.remove("hide-cursor"));
  });
}

/* Scroll Reveal Animation */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const sr = typeof ScrollReveal === "function" ? ScrollReveal({
  origin: "top",
  distance: prefersReducedMotion ? "0px" : "36px",
  duration: prefersReducedMotion ? 0 : 700,
  delay: 100,
  reset: false, // Animate elements once as they enter the viewport.
  mobile: true,
  viewFactor: 0.12,
  cleanup: true,
}) : null;

//home, project and work section animations
if (sr) {
  sr.reveal(
    `.home__image, .projects__container, .work__container, .testimonials__container, .contact__container`
  );
  sr.reveal(`.home__data`, { delay: 250, origin: "bottom" });
  sr.reveal(`.home__info`, { delay: 350, origin: "bottom" });
  sr.reveal(`.home__social, .home__cv`, { delay: 350 });
  sr.reveal(`.about__data`, { origin: "left" });
  sr.reveal(`.about__image`, { origin: "right" });
  sr.reveal(`.services__card`, { interval: 100 });
}
