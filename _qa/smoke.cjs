const puppeteer = require("puppeteer-core");
const EXE = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = "http://localhost:8080/";

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EXE,
    headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars"]
  });
  const results = [];

  async function view(name, vp, theme, go) {
    const page = await browser.newPage();
    await page.setViewport(vp);
    const issues = [];
    const bad = [];
    page.on("console", m => {
      if (m.type() === "error" || m.type() === "warning") issues.push(`console.${m.type()}: ${m.text()}`);
    });
    page.on("pageerror", e => issues.push("pageerror: " + e.message));
    page.on("response", r => { if (r.status() >= 400) bad.push(r.status() + " " + r.url()); });
    await page.evaluateOnNewDocument(() => {
      window.__shifts = [];
      try {
        new PerformanceObserver(list => {
          for (const e of list.getEntries()) if (!e.hadRecentInput) window.__shifts.push(e);
        }).observe({ type: "layout-shift", buffered: true });
      } catch (e) {}
    });
    const url = BASE + "?theme=" + theme + (go ? "&go=" + go : "");
    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 1400));
    const cls = await page.evaluate(() => window.__shifts.reduce((a, e) => a + e.value, 0));
    const probe = await page.evaluate(() => {
      const img = document.querySelector("#portraitImg");
      const g = [...document.querySelectorAll(".g-item")];
      const wa = document.querySelector("[data-wa]");
      const call = document.querySelector("#phoneNumberLabel");
      const waLab = document.querySelector("#waNumberLabel");
      const office = document.querySelector("#officeLabel");
      const email = document.querySelector("#emailLabel");
      const noDims = g.filter(f => {
        const i = f.querySelector("img");
        return !i.getAttribute("width") || !i.getAttribute("height");
      }).length;
      const caps = g.map(f => f.querySelector("figcaption").textContent);
      const overflowX = document.documentElement.scrollWidth > document.documentElement.clientWidth;
      return {
        portraitNatural: img ? img.naturalWidth : null,
        noPhoto: img ? img.classList.contains("no-photo") : null,
        galleryCount: g.length,
        galleryNoDims: noDims,
        captions: caps,
        waHref: wa ? wa.getAttribute("href").slice(0, 40) : null,
        callText: call ? call.textContent : null,
        waText: waLab ? waLab.textContent : null,
        officeText: office ? office.textContent : null,
        emailText: email ? email.textContent : null,
        overflowX
      };
    });
    await page.screenshot({ path: `shots/${name}.png` });
    results.push({ name, cls: +cls.toFixed(4), bad, issues, probe });
    await page.close();
  }

  await view("hero-dark", { width: 1440, height: 900 }, "dark");
  await view("advocate-light", { width: 1440, height: 1050 }, "light", "advocate");
  await view("advocate-dark", { width: 1440, height: 1050 }, "dark", "advocate");
  await view("m375-advocate-dark", { width: 375, height: 812 }, "dark", "advocate");
  await view("m375-hero-light", { width: 375, height: 812 }, "light");
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
