(function () {
  const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function canGsap() {
    return typeof gsap !== "undefined" && motionOk;
  }

  function initHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 10);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function reveal(selector, { trigger, y = 20, stagger = 0.08, start = "top 80%" } = {}) {
    const els = gsap.utils.toArray(selector);
    if (!els.length) return;
    gsap.from(els, {
      opacity: 0,
      y,
      duration: 0.55,
      ease: "power2.out",
      stagger,
      clearProps: "transform",
      scrollTrigger: {
        trigger: trigger || els[0],
        start,
        once: true,
      },
    });
  }

  function initPageMotion() {
    initHeader();
    if (!canGsap()) return;
    if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

    if (document.querySelector(".hero-copy")) {
      gsap.from(".hero-copy > *", {
        opacity: 0,
        y: 16,
        duration: 0.55,
        stagger: 0.07,
        ease: "power2.out",
        delay: 0.05,
      });
    }

    if (document.querySelector(".faq-hero-copy")) {
      gsap.from(".faq-hero-copy > *", {
        opacity: 0,
        y: 16,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
      });
    }

    reveal(".stats > div", { trigger: ".stats", y: 14, stagger: 0.1 });
    reveal(".why-photo, .why-copy", { trigger: ".why", stagger: 0.12 });
    reveal(".sample-card", { trigger: "#sample", y: 24 });
    reveal(".quiz-intro-head > *", { trigger: "#builder", stagger: 0.06 });
    reveal(".audiences .aud-card", { trigger: "#audiences", stagger: 0.1 });
    reveal(".compare .aud-card", { trigger: "#leads-vs", stagger: 0.1 });
    reveal(".campaigns-panel", { trigger: ".campaigns", y: 24 });
    reveal(".faq-list details", { trigger: "#faq", y: 12, stagger: 0.05 });

    const items = document.querySelectorAll(".how-steps li");
    const line = document.querySelector(".how-line");
    if (items.length) {
      gsap.set(items, { opacity: 0, y: 24 });
      if (line) gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#how",
          start: "top 72%",
          once: true,
        },
      });
      if (line) tl.to(line, { scaleX: 1, duration: 0.7, ease: "power2.out" }, 0);
      tl.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.12,
        ease: "power2.out",
        clearProps: "transform",
      }, 0.12);
    }
  }

  initPageMotion();
})();
