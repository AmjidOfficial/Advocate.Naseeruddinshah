const puppeteer = require("puppeteer-core");
const EXE = "C:/Program Files/Google/Chrome/Application/chrome.exe";

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EXE, headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage"]
  });
  const page = await browser.newPage();
  await page.goto("http://localhost:8080/", { waitUntil: "networkidle0", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  const out = await page.evaluate(async () => {
    const cv = document.createElement("canvas").getContext("2d");
    const load = (spec, text) => document.fonts.load(spec, text).catch(() => {});
    const measure = (spec, family, text) => {
      cv.font = spec;
      const w = cv.measureText(text).width;
      return w;
    };
    const D = "Defending Rights. Engineering Justice. Advocate Supreme Court of Pakistan.";
    const B = "For two decades, Naseer Uddin Shah has appeared across Pakistan's court hierarchy as counsel, state prosecutor and officer of the court.";
    const M = "SCBA MEMBER · FORMER ADDITIONAL ADVOCATE GENERAL KP — 0333 9552292";
    await load('700 100px "Cinzel"', D);
    await load('400 100px "Manrope"', B);
    await load('500 100px "JetBrains Mono"', M);
    const pairs = [
      { web: '"Cinzel"', spec: '700 100px', text: D, locals: ['Georgia', 'Times New Roman'] },
      { web: '"Manrope"', spec: '400 100px', text: B, locals: ['Segoe UI', 'Arial'] },
      { web: '"JetBrains Mono"', spec: '500 100px', text: M, locals: ['Consolas', 'Courier New'] }
    ];
    const res = [];
    for (const p of pairs) {
      cv.font = `${p.spec} ${p.web}`;
      const wWeb = cv.measureText(p.text).width;
      for (const loc of p.locals) {
        cv.font = `${p.spec} "${loc}"`;
        const wLoc = cv.measureText(p.text).width;
        res.push({ pair: p.web + " vs " + loc, web: +wWeb.toFixed(1), local: +wLoc.toFixed(1),
                   sizeAdjust: +(100 * wWeb / wLoc).toFixed(2) });
      }
    }
    return res;
  });
  console.log(JSON.stringify(out, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
