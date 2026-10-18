const puppeteer = require("puppeteer-core");
const EXE = "C:/Program Files/Google/Chrome/Application/chrome.exe";

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EXE,
    headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars"]
  });

  async function diag(name, vp, theme) {
    const page = await browser.newPage();
    await page.setViewport(vp);
    await page.evaluateOnNewDocument(() => {
      window.__shifts = [];
      try {
        new PerformanceObserver(list => {
          for (const e of list.getEntries()) {
            if (e.hadRecentInput) continue;
            const sources = (e.sources || []).map(s => {
              const el = s.node;
              if (!el || !el.tagName) return "(text)";
              const id = el.id ? "#" + el.id : "";
              const cls = (typeof el.className === "string" && el.className)
                ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "";
              return el.tagName.toLowerCase() + id + cls;
            });
            window.__shifts.push({ v: +e.value.toFixed(4), at: Math.round(e.startTime), sources });
          }
        }).observe({ type: "layout-shift", buffered: true });
      } catch (e) {}
    });
    await page.goto(`http://localhost:8080/?theme=${theme}&go=advocate`, { waitUntil: "networkidle0", timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 4000));
    const out = await page.evaluate(() => {
      const seen = {};
      for (const s of window.__shifts) {
        const k = s.sources.join(" | ") || "(anon)";
        seen[k] = (seen[k] || 0) + s.v;
      }
      return { total: +window.__shifts.reduce((a, e) => a + e.v, 0).toFixed(4),
               entries: window.__shifts, grouped: seen };
    });
    console.log("==== " + name + " ====");
    console.log(JSON.stringify(out, null, 2));
    await page.close();
  }

  await diag("advocate-dark-1440", { width: 1440, height: 1050 }, "dark");
  await diag("advocate-dark-375", { width: 375, height: 812 }, "dark");
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
