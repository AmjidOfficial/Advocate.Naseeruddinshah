/* ============================================================================
   CHAMBERS ENGINE — vanilla DOM, zero dependencies
   Theme · kinetic type · 3D tilt · gold dust · renderers · counters
   Scrollspy · drawers (focus-trapped) · booking machine · WhatsApp handoff
   ========================================================================== */
(() => {
  "use strict";

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SITE = window.SITE;

  const digits = (n) => String(n || "").replace(/\D/g, "");
  const waDigits = digits(SITE.contact.whatsapp);
  const waLink = (msg) => `https://wa.me/${waDigits}?text=${encodeURIComponent(msg || SITE.whatsappGreeting)}`;
  const telLink = () => `tel:${String(SITE.contact.phone).replace(/[^\d+]/g, "")}`;

  /* ------------------------------------------------ contacts + labels */
  const wireContacts = () => {
    $$("[data-wa]").forEach(a => { a.href = waLink(); a.target = "_blank"; a.rel = "noopener"; });
    $$("[data-call]").forEach(a => { a.href = telLink(); });
    const email = $("#emailChannel");
    if (email) {
      email.href = `mailto:${SITE.contact.email}?subject=${encodeURIComponent("Consultation Enquiry — Chambers")}`;
      $("#emailLabel").textContent = SITE.contact.email;
    }
    $("#officeLabel").textContent = SITE.contact.office;
    $("#hoursLabel").textContent  = SITE.contact.hours;
    const local = (d) => {
      let x = d.startsWith("92") ? d.slice(2) : d;
      if (!x.startsWith("0")) x = "0" + x;
      return x;
    };
    const waDisplay = local(waDigits).replace(/(\d{4})(\d{7})/, "$1 $2");
    const waLabel = $("#waNumberLabel");
    if (waLabel) waLabel.textContent = `WhatsApp · ${waDisplay}`;
    const phLabel = $("#phoneNumberLabel");
    if (phLabel) {
      const land = digits(SITE.contact.landline || "");
      const landDisplay = land ? local(land).replace(/(\d{3})(\d{7})/, "$1 $2") : "";
      phLabel.textContent = landDisplay ? `Call · ${waDisplay} / ${landDisplay}` : `Call · ${waDisplay}`;
    }
    $$(".status-text").forEach(el => el.textContent = SITE.status.text);
    if (waDigits === "923000000000") {
      console.warn("[Chambers] Placeholder WhatsApp/phone in js/data.js — replace SITE.contact before launch.");
    }
  };

  /* ------------------------------------------------ theme engine */
  const themeInit = () => {
    const root = document.documentElement;
    const meta = $("#metaThemeColor");
    const btn = $("#themeToggle");
    let stored = null;
    try { stored = localStorage.getItem("chambers-theme"); } catch (e) {}
    const system = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    const qTheme = new URLSearchParams(location.search).get("theme");
    const initial = (qTheme === "light" || qTheme === "dark") ? qTheme : (stored || system);
    const apply = (t) => {
      root.dataset.theme = t;
      meta.content = t === "light" ? "#F6F4EE" : "#101216";
      btn.setAttribute("aria-pressed", String(t === "light"));
      try { localStorage.setItem("chambers-theme", t); } catch (e) {}
    };
    apply(initial);
    btn.addEventListener("click", () => apply(root.dataset.theme === "dark" ? "light" : "dark"));
  };

  /* ------------------------------------------------ kinetic headline */
  const kinetic = () => {
    $$("[data-split]").forEach(line => {
      const text = line.textContent;
      line.textContent = "";
      let i = 0;
      text.split(" ").forEach((word, w) => {
        if (w) line.appendChild(document.createTextNode(" "));
        const wd = document.createElement("span");
        wd.className = "wd";
        [...word].forEach(ch => {
          const span = document.createElement("span");
          span.className = "ch";
          span.textContent = ch;
          span.style.transitionDelay = `${i++ * 26}ms`;
          wd.appendChild(span);
        });
        line.appendChild(wd);
      });
    });
    document.body.classList.remove("fonts-wait");
    setTimeout(() => document.body.classList.add("hero-in"), REDUCED ? 0 : 180);
  };

  /* ------------------------------------------------ gold-dust canvas */
  const dust = () => {
    if (REDUCED) return;
    const cv = $("#dustCanvas");
    const ctx = cv.getContext("2d");
    let W, H, DPR, parts = [], running = true, raf;

    const size = () => {
      DPR = Math.min(devicePixelRatio || 1, 2);
      const r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = W * DPR; cv.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const n = Math.min(85, Math.floor(W / 15));
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.6 + .4,
        vy: -(Math.random() * .22 + .06),
        vx: (Math.random() - .5) * .12,
        ph: Math.random() * Math.PI * 2,
        sp: Math.random() * .014 + .004
      }));
    };

    const draw = (t) => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.y += p.vy; p.x += p.vx; p.ph += p.sp;
        if (p.y < -6) { p.y = H + 6; p.x = Math.random() * W; }
        if (p.x < -6) p.x = W + 6;
        if (p.x > W + 6) p.x = -6;
        const a = .12 + Math.abs(Math.sin(p.ph)) * .38;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 7);
        ctx.fillStyle = `rgba(212,175,55,${a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    size();
    addEventListener("resize", size, { passive: true });
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { running = true; raf = requestAnimationFrame(draw); }
      else if (!e.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
    }).observe(cv);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && running) { running = false; cancelAnimationFrame(raf); }
      else if (!document.hidden) { running = true; raf = requestAnimationFrame(draw); }
    });
    raf = requestAnimationFrame(draw);
  };

  /* ------------------------------------------------ 3D tilt engine */
  const tilt = (zone, target, max, setSheen) => {
    if (REDUCED) return;
    let raf = null, px = 0, py = 0;
    const apply = () => {
      raf = null;
      target.style.setProperty("--ry", `${(px * max).toFixed(2)}deg`);
      target.style.setProperty("--rx", `${(-py * max * 0.8).toFixed(2)}deg`);
      if (setSheen) {
        zone.style.setProperty("--mx", `${((px + .5) * 100).toFixed(1)}%`);
        zone.style.setProperty("--my", `${((py + .5) * 100).toFixed(1)}%`);
        const sheen = $(".portrait-sheen");
        if (sheen) {
          sheen.style.setProperty("--px", `${((px + .5) * 100).toFixed(1)}%`);
          sheen.style.setProperty("--py", `${((py + .5) * 100).toFixed(1)}%`);
        }
      }
    };
    zone.addEventListener("pointermove", (e) => {
      const r = zone.getBoundingClientRect();
      px = (e.clientX - r.left) / r.width - .5;
      py = (e.clientY - r.top) / r.height - .5;
      if (!raf) raf = requestAnimationFrame(apply);
    });
    zone.addEventListener("pointerleave", () => {
      px = 0; py = 0;
      if (!raf) raf = requestAnimationFrame(apply);
    });
  };

  /* ------------------------------------------------ renderers */
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const renderPractice = () => {
    const grid = $("#practiceGrid");
    grid.innerHTML = SITE.practice.map((p, i) => `
      <article class="p-card reveal" data-delay="${i % 3}" tabindex="0" role="button"
               aria-pressed="false" aria-label="${esc(p.title)} — activate to view the brief">
        <div class="p-inner">
          <div class="p-face p-front">
            <span class="p-ico" aria-hidden="true">${p.icon}</span>
            <h3>${esc(p.title)}</h3>
            <p>${esc(p.blurb)}</p>
            <span class="p-hint"><i class="dot" aria-hidden="true"></i>Open the brief</span>
          </div>
          <div class="p-face p-back" aria-hidden="true">
            <span class="p-law">${esc(p.law)}</span>
            <ul>${p.points.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
            <button class="btn" type="button" data-matter="${esc(p.key)}">Discuss this matter →</button>
          </div>
        </div>
      </article>`).join("");

    $$(".p-card", grid).forEach(card => {
      tilt(card, card, 7, false);
      const isControl = (e) => !!e.target.closest("[data-matter], button, a");
      const flip = () => {
        const on = card.classList.toggle("is-flipped");
        card.setAttribute("aria-pressed", String(on));
        card.setAttribute("aria-label",
          `${card.querySelector("h3").textContent} — ${on ? "brief open, activate to close" : "activate to view the brief"}`);
      };
      card.addEventListener("click", (e) => { if (!isControl(e)) flip(); });
      card.addEventListener("keydown", (e) => {
        if (e.target.closest("button")) return;
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
      });
    });

    grid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-matter]");
      if (!btn) return;
      e.stopPropagation();
      const card = btn.closest(".p-card");
      card.classList.remove("is-flipped");
      card.setAttribute("aria-pressed", "false");
      openBooking(btn.dataset.matter);
    });
  };

  const renderTimeline = () => {
    const list = $("#timeline");
    list.innerHTML = SITE.timeline.map((t, i) => `
      <li class="tl-item reveal ${t.current ? "is-current" : ""}" data-cat="${t.cat}">
        <span class="tl-node" aria-hidden="true"></span>
        <div class="tl-card">
          <span class="tl-when">${esc(t.when)}</span>
          <h3>${esc(t.title)}</h3>
          <p>${esc(t.desc)}</p>
          <span class="tl-tag">${t.cat === "state" ? "State Service" : t.cat === "bar" ? "Bar Leadership" : "Call & Education"}</span>
        </div>
      </li>`).join("");
  };

  const renderFilters = () => {
    $("#timelineFilters").addEventListener("click", (e) => {
      const chip = e.target.closest(".filter-chip");
      if (!chip) return;
      $$(".filter-chip").forEach(c => {
        const on = c === chip;
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-pressed", String(on));
      });
      const f = chip.dataset.filter;
      $$(".tl-item").forEach(item =>
        item.classList.toggle("is-hidden", f !== "all" && item.dataset.cat !== f));
    });
  };

  const renderFaq = () => {
    $("#faqList").innerHTML = SITE.faq.map((f) => `
      <div class="faq-item reveal">
        <button class="faq-q" aria-expanded="false" aria-controls="a${esc(f.q.slice(0, 8).replace(/\W/g, ""))}">
          <span>${esc(f.q)}</span>
          <span class="faq-ico" aria-hidden="true"></span>
        </button>
        <div class="faq-a" id="a${esc(f.q.slice(0, 8).replace(/\W/g, ""))}" role="region">
          <div class="faq-a-inner"><p>${esc(f.a)}</p></div>
        </div>
      </div>`).join("");

    $$(".faq-item").forEach(item => {
      const q = $(".faq-q", item);
      q.addEventListener("click", () => {
        const open = item.classList.toggle("is-open");
        q.setAttribute("aria-expanded", String(open));
      });
    });
  };

  const renderNews = () => {
    const mount = $("#newsMount");
    if (!SITE.news.length) {
      mount.insertAdjacentHTML("beforeend", `<p class="news-empty">Record entries will appear here.</p>`);
      return;
    }
    mount.insertAdjacentHTML("beforeend", SITE.news.map(n => `
      <div class="news-item">
        <span class="tl-when">${esc(n.when)}</span>
        <h4>${esc(n.title)}</h4>
        <p>${esc(n.body)}</p>
        <span class="news-src">Source · ${esc(n.src)}</span>
      </div>`).join(""));
  };

  const renderGallery = () => {
    const mount = $("#galleryMount");
    if (!mount || !SITE.gallery || !SITE.gallery.length) return;
    mount.innerHTML = SITE.gallery.map(g => `
      <figure class="g-item reveal${g.tall ? " is-tall" : ""}">
        <img src="${esc(g.src)}" alt="${esc(g.alt)}" width="${g.w}" height="${g.h}" loading="lazy" decoding="async">
        <figcaption>${esc(g.caption)}</figcaption>
      </figure>`).join("");
  };

  /* ------------------------------------------------ counters */
  const counters = () => {
    const nums = $$("[data-count]");
    if (REDUCED) { nums.forEach(n => n.textContent = n.dataset.count); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        io.unobserve(el);
        const target = +el.dataset.count;
        const t0 = performance.now();
        const dur = 1500;
        const tick = (now) => {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: .5 });
    nums.forEach(n => io.observe(n));
  };

  /* ------------------------------------------------ nav: scrollspy · progress · to-top */
  const navBits = () => {
    const shell = $("#navShell");
    const progress = $(".scroll-progress");
    const toTop = $("#toTop");
    let ticking = false;

    const onScroll = () => {
      const y = scrollY;
      shell.classList.toggle("is-scrolled", y > 12);
      toTop.classList.toggle("is-shown", y > 700);
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      ticking = false;
    };
    addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();
    toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" }));

    const floatingActions = $(".fab-cluster");
    const unobscuredSections = new Set();
    const floatingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) unobscuredSections.add(entry.target);
        else unobscuredSections.delete(entry.target);
      });
      const obscured = unobscuredSections.size > 0;
      floatingActions.classList.toggle("is-obscured", obscured);
      toTop.classList.toggle("is-obscured", obscured);
    }, { rootMargin: "-8% 0px -8% 0px" });
    ["top", "service", "contact"].forEach(id => {
      const section = document.getElementById(id);
      if (section) floatingObserver.observe(section);
    });

    const links = $$("#navLinks a");
    const map = new Map();
    links.forEach(a => {
      const id = a.getAttribute("href").slice(1);
      if (!map.has(id)) map.set(id, []);
      map.get(id).push(a);
    });
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        links.forEach(a => a.classList.remove("is-active"));
        (map.get(en.target.id) || []).forEach(a => a.classList.add("is-active"));
      });
    }, { rootMargin: "-42% 0px -52% 0px" });
    ["advocate", "practice", "service", "jurisdiction", "faq", "contact"].forEach(id => {
      const s = document.getElementById(id);
      if (s) spy.observe(s);
    });
  };

  /* ------------------------------------------------ generic drawer mechanics */
  const focusables = (root) =>
    $$('a[href], button:not([disabled]), input, select, textarea, [tabindex="0"]', root)
      .filter(el => el.offsetParent !== null && !el.hasAttribute("aria-disabled"));

  const makeDrawer = (drawerSel, backdropSel, openSel) => {
    const drawer = $(drawerSel);
    const backdrop = $(backdropSel);
    const openers = $$(openSel ? openSel : "none-matches");
    let lastFocus = null;

    const syncOpeners = (on) => openers.forEach(el => {
      el.setAttribute("aria-expanded", String(on));
      if (el.dataset.closeLabel) {
        if (!el.dataset.openLabel) el.dataset.openLabel = el.getAttribute("aria-label") || "";
        el.setAttribute("aria-label", on ? el.dataset.closeLabel : el.dataset.openLabel);
      }
    });

    const open = () => {
      lastFocus = document.activeElement;
      backdrop.hidden = false;
      document.body.classList.add("no-scroll");
      requestAnimationFrame(() => {
        backdrop.classList.add("is-shown");
        drawer.classList.add("is-open");
        const first = focusables(drawer)[0];
        if (first) first.focus();
      });
      drawer.setAttribute("aria-hidden", "false");
      syncOpeners(true);
    };
    const close = () => {
      backdrop.classList.remove("is-shown");
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      document.body.classList.remove("no-scroll");
      syncOpeners(false);
      setTimeout(() => { backdrop.hidden = true; }, 400);
      if (lastFocus) lastFocus.focus();
    };
    const toggle = () => drawer.classList.contains("is-open") ? close() : open();

    openers.forEach(el => el.addEventListener("click", (e) => { e.preventDefault(); toggle(); }));
    drawer.addEventListener("click", (e) => {
      if (e.target.closest("[data-close], .drawer-close, .drawer-links a")) close();
    });
    backdrop.addEventListener("click", close);
    drawer.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { e.stopPropagation(); close(); }
      if (e.key === "Tab") {
        const f = focusables(drawer);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    return { open, close, toggle, drawer };
  };

  /* ------------------------------------------------ booking machine */
  let bookDrawer, sideDrawerCtl;
  const booking = {
    step: 1, matter: null, mode: null,
    go(n) {
      this.step = n;
      $$(".book-step").forEach(f => f.classList.toggle("is-active", +f.dataset.step === n));
      $$(".book-steps li").forEach(li => {
        const s = +li.dataset.step;
        li.classList.toggle("is-active", s === n);
        li.classList.toggle("is-done", s < n);
      });
      $("#bookBack").hidden = n === 1;
      $("#bookNext").hidden = n === 3;
      $("#bookSend").hidden = n !== 3;
      if (n === 3) this.summary();
    },
    next() {
      if (this.step === 1 && !this.matter) { flash($("#bookMatter"), "Select the nature of your matter."); return; }
      if (this.step === 2 && !this.mode)  { flash($("#bookMode"), "Choose a consultation mode."); return; }
      this.go(Math.min(this.step + 1, 3));
    },
    back() { this.go(Math.max(this.step - 1, 1)); },
    summary() {
      $("#bookSummary").innerHTML =
        `MATTER · ${esc(this.matter)}<br>MODE · ${esc(this.mode)}` +
        ($("#bookWhen").value ? `<br>PREFERRED · ${esc($("#bookWhen").value)}` : "");
    },
    send() {
      const name = $("#bookName"), phone = $("#bookPhone"), confirm = $("#bookConfirm");
      let ok = true;
      ok &= field(name, name.value.trim().length >= 2, "Please give your full name.");
      ok &= field(phone, digits(phone.value).length >= 7, "A reachable phone / WhatsApp number is required.");
      ok &= field(confirm, confirm.checked, "Please acknowledge the notice to continue.");
      if (!ok) return;
      const msg =
        `Assalam-o-Alaikum. Consultation request — Chambers of Naseer Uddin Shah.` +
        `\n\nName: ${name.value.trim()}` +
        `\nPhone: ${phone.value.trim()}` +
        `\nNature of matter: ${this.matter}` +
        `\nConsultation mode: ${this.mode}` +
        ($("#bookWhen").value ? `\nPreferred time: ${$("#bookWhen").value}` : "") +
        `\n\nSent from the chambers website.`;
      window.open(waLink(msg), "_blank", "noopener");
      $("#bookSummary").innerHTML += `<br>STATUS · Opening WhatsApp…`;
    }
  };

  const flash = (el, msg) => {
    if (!el) return;
    el.style.outline = "2px solid var(--danger)";
    el.style.outlineOffset = "4px";
    el.style.borderRadius = "12px";
    setTimeout(() => { el.style.outline = ""; }, 1600);
    const legend = el.closest("fieldset").querySelector("legend");
    legend.textContent = msg;
    setTimeout(() => { legend.textContent = legend.dataset.orig; }, 2600);
  };

  const field = (input, valid, msg) => {
    const wrap = input.closest(".field") || input.closest("label");
    const err = $(`[data-error-for="${input.id}"]`);
    input.setAttribute("aria-invalid", String(!valid));
    if (wrap) wrap.classList.toggle("is-invalid", !valid);
    if (err) err.textContent = valid ? "" : msg;
    return valid;
  };

  const renderBooking = () => {
    const legendEls = $$(".book-step legend");
    legendEls.forEach(l => l.dataset.orig = l.textContent);

    $("#bookMatter").innerHTML = SITE.booking.matters.map(m =>
      `<button type="button" class="choice" role="radio" aria-checked="false" data-val="${esc(m)}">${esc(m)}</button>`).join("");
    $("#bookMode").innerHTML = SITE.booking.modes.map(m =>
      `<button type="button" class="choice" role="radio" aria-checked="false" data-val="${esc(m.title)}">${esc(m.title)}<small>${esc(m.sub)}</small></button>`).join("");

    const wireRadios = (sel, set) => {
      $$(sel + " .choice").forEach(btn => {
        const pick = () => {
          $$(`${sel} .choice`).forEach(b => b.setAttribute("aria-checked", "false"));
          btn.setAttribute("aria-checked", "true");
          set(btn.dataset.val);
        };
        btn.addEventListener("click", pick);
        btn.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); }
        });
      });
    };
    wireRadios("#bookMatter", v => { booking.matter = v; });
    wireRadios("#bookMode",  v => { booking.mode = v; });

    $("#bookNext").addEventListener("click", () => booking.next());
    $("#bookBack").addEventListener("click", () => booking.back());
    $("#bookForm").addEventListener("submit", (e) => { e.preventDefault(); booking.send(); });
  };

  const openBooking = (matterKey) => {
    if (matterKey) {
      const p = SITE.practice.find(x => x.key === matterKey);
      if (p) {
        const map = {
          constitutional: "Constitutional / Writ",
          criminal: "Criminal Defence or Appeal",
          civil: "Civil / Property",
          administrative: "Service / Government",
          revenue: "Revenue / Land",
          islamic: "Family / Islamic Law"
        };
        const val = map[matterKey] || p.title;
        booking.matter = val;
        $$("#bookMatter .choice").forEach(b =>
          b.setAttribute("aria-checked", String(b.dataset.val === val)));
      }
    }
    booking.go(booking.matter && matterKey ? 2 : 1);
    bookDrawer.open();
  };

  /* ------------------------------------------------ matter form → WhatsApp */
  const matterForm = () => {
    const form = $("#matterForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#fName"), phone = $("#fPhone"), area = $("#fArea");
      let ok = true;
      ok &= field(name, name.value.trim().length >= 2, "Please give your full name.");
      ok &= field(phone, digits(phone.value).length >= 7, "A reachable phone / WhatsApp number is required.");
      ok &= field(area, !!area.value, "Select the nature of your matter.");
      if (!ok) { $("#formStatus").textContent = "COMPLETE THE HIGHLIGHTED FIELDS."; return; }
      const msg =
        `Assalam-o-Alaikum. Enquiry — Chambers of Naseer Uddin Shah.` +
        `\n\nName: ${name.value.trim()}` +
        `\nPhone: ${phone.value.trim()}` +
        `\nNature of matter: ${area.value}` +
        ($("#fMsg").value.trim() ? `\n\nSituation: ${$("#fMsg").value.trim()}` : "") +
        `\n\nSent from the chambers website.`;
      window.open(waLink(msg), "_blank", "noopener");
      $("#formStatus").textContent = "OPENING WHATSAPP — IF NOTHING OPENS, PLEASE CALL THE CHAMBERS.";
      form.reset();
    });
  };

  /* ------------------------------------------------ roster dropdown */
  const roster = () => {
    const t = $("#rosterToggle"), m = $("#rosterMenu");
    if (!t) return;
    const close = () => { m.classList.remove("is-open"); t.setAttribute("aria-expanded", "false"); };
    t.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = m.classList.toggle("is-open");
      t.setAttribute("aria-expanded", String(open));
    });
    $$(".roster-item", m).forEach(a => a.addEventListener("click", close));
    document.addEventListener("click", (e) => { if (!m.contains(e.target)) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  };

  /* ------------------------------------------------ reveal + portrait + year */
  const reveals = () => {
    if (REDUCED) { $$(".reveal").forEach(el => el.classList.add("in-view")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("in-view"); io.unobserve(en.target); }
      });
    }, { threshold: .12 });
    $$(".reveal").forEach(el => io.observe(el));
  };

  const portrait = () => {
    const img = $("#portraitImg");
    if (!img) return;
    img.addEventListener("error", () => img.classList.add("no-photo"));
    if (img.complete && img.naturalWidth === 0) img.classList.add("no-photo");
  };

  /* ------------------------------------------------ boot */
  document.addEventListener("DOMContentLoaded", () => {
    wireContacts();
    themeInit();
    document.body.classList.add("fonts-wait");
    let kineticStarted = false;
    const startKinetic = () => {
      if (kineticStarted) return;
      kineticStarted = true;
      kinetic();
    };
    // Gate on the display face alone: it is the only font whose swap changes
    // the headline's wrap. Waiting on fonts.ready or other faces lets the raw
    // headline paint in swapped metrics first (layout shift). The load
    // promise resolves in the same task the font becomes usable, so the
    // rebuild below happens before that layout ever paints.
    const DISPLAY_FONT = "700 1em Cinzel";
    (async () => {
      try {
        for (let i = 0; i < 100; i++) {
          if (document.fonts.check(DISPLAY_FONT)) break;
          await Promise.race([
            document.fonts.load(DISPLAY_FONT, "Defending Rights."),
            new Promise(r => setTimeout(r, 25)),
          ]);
        }
      } catch (e) { /* ladder below is the safety net */ }
      startKinetic();
    })();
    // Safety net that never reveals fallback metrics early: if Cinzel is still
    // pending at 2.5s keep the hero hidden and re-check each second (hard cap
    // 6.5s for dead connections). Revealing early would paint the headline in
    // fallback metrics and re-introduce the font-swap layout shift.
    let ladderWait = 2500;
    const revealLadder = () => {
      if (kineticStarted) return;
      let cinzelIn = true;
      try { cinzelIn = document.fonts.check(DISPLAY_FONT); } catch (e) { cinzelIn = true; }
      if (cinzelIn || ladderWait >= 6500) { startKinetic(); return; }
      ladderWait += 1000;
      setTimeout(revealLadder, 1000);
    };
    setTimeout(revealLadder, 2500);
    renderPractice();
    renderTimeline();
    renderFilters();
    renderFaq();
    renderNews();
    renderGallery();
    renderBooking();
    matterForm();
    counters();
    navBits();
    roster();
    portrait();
    reveals();

    const stage = $("#sealStage"), seal = $("#seal3d");
    if (stage && seal) tilt(stage, seal, 14, true);

    bookDrawer = makeDrawer("#bookingDrawer", "#bookBackdrop", null);
    sideDrawerCtl = makeDrawer("#sideDrawer", "#drawerBackdrop", "#navBurger");

    $$("[data-book-open]").forEach(el => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        openBooking(el.dataset.matter || undefined);
      });
    });

    /* in-page anchors close the side drawer */
    $$('.side-drawer a[href^="#"]').forEach(a =>
      a.addEventListener("click", () => sideDrawerCtl.close()));

    /* deep links: ?go=practice jumps to a section once the hero has settled
       (also used for QA captures). Jumping at DOMContentLoaded would land
       mid-font-swap: the hero text then re-wraps above the viewport and the
       whole page shifts under the reader. */
    const go = new URLSearchParams(location.search).get("go");
    if (go) {
      const target = document.getElementById(go);
      if (target) {
        document.documentElement.style.scrollBehavior = "auto";
        const jump = () => target.scrollIntoView();
        if (document.body.classList.contains("hero-in")) jump();
        else {
          const mo = new MutationObserver(() => {
            if (document.body.classList.contains("hero-in")) {
              mo.disconnect();
              setTimeout(jump, 60);
            }
          });
          mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });
          setTimeout(jump, 7000);
        }
      }
    }

    $("#yearNow").textContent = new Date().getFullYear();
    dust();
  });
})();
