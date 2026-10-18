const puppeteer = require("puppeteer-core");
const EXE = "C:/Program Files/Google/Chrome/Application/chrome.exe";

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EXE, headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage"]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:8080/?theme=dark", { waitUntil: "networkidle0", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);

  const out = await page.evaluate(async () => {
    await document.fonts.load('700 80px "Cinzel"', "Defending Rights.");
    await document.fonts.load('400 20px "Manrope"', "For two decades");
    await document.fonts.load('500 20px "JetBrains Mono"', "SCBA MEMBER");

    function probeHeight(text, family, weight, fsPx, widthPx, lh) {
      const d = document.createElement("div");
      d.style.cssText =
        `position:absolute;left:-9999px;top:0;width:${widthPx}px;` +
        `font-family:${family};font-weight:${weight};font-size:${fsPx}px;` +
        `line-height:${lh};letter-spacing:.005em;visibility:hidden;`;
      d.textContent = text;
      document.body.appendChild(d);
      const h = d.clientHeight;
      d.remove();
      return h;
    }

    const TITLE = "Defending Rights. Engineering Justice.";
    const SUB = "For two decades, Naseer Uddin Shah has appeared across Pakistan's court hierarchy — as counsel, state prosecutor and officer of the court — from the District Judiciary of Peshawar to the Supreme Court of Pakistan.";
    const NOTE = "SCBA MEMBER · FORMER ADDITIONAL ADVOCATE GENERAL KP";

    const cases = [
      { name: "title-375",  text: TITLE, web: '"Cinzel"', loc: "Georgia",   w: 700, fs: 34.4, lh: 1.06, widths: [300, 327, 355] },
      { name: "title-768",  text: TITLE, web: '"Cinzel"', loc: "Georgia",   w: 700, fs: 51,   lh: 1.06, widths: [420, 560, 640] },
      { name: "title-1440", text: TITLE, web: '"Cinzel"', loc: "Georgia",   w: 700, fs: 81.6, lh: 1.06, widths: [480, 560, 640] },
      { name: "sub-375",    text: SUB,   web: '"Manrope"', loc: '"Segoe UI"', w: 400, fs: 16,  lh: 1.7,  widths: [300, 327, 355] },
      { name: "sub-1440",   text: SUB,   web: '"Manrope"', loc: '"Segoe UI"', w: 400, fs: 18,  lh: 1.7,  widths: [480, 544, 560] },
      { name: "note-375",   text: NOTE,  web: '"JetBrains Mono"', loc: '"Courier New"', w: 500, fs: 11, lh: 1.7, widths: [300, 327, 355] }
    ];

    const report = [];
    for (const c of cases) {
      const row = { name: c.name, best: null, scan: [] };
      for (const wd of c.widths) {
        const hWeb = probeHeight(c.text, c.web, c.w, c.fs, wd, c.lh);
        let bestS = null, bestD = 1e9, bestH = 0;
        for (let s = 100; s <= 116; s += 0.25) {
          const hLoc = probeHeight(c.text, c.loc, c.w, c.fs * s / 100, wd, c.lh);
          const diff = Math.abs(hLoc - hWeb);
          if (diff < bestD) { bestD = diff; bestS = s; bestH = hLoc; }
        }
        row.scan.push({ width: wd, hWeb, hLoc: bestH, sizeAdjust: bestS, diffPx: +(bestD.toFixed(1)) });
      }
      report.push(row);
    }
    return report;
  });
  console.log(JSON.stringify(out, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
