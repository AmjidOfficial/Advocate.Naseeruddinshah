const puppeteer = require("puppeteer-core");
const EXE = "C:/Program Files/Google/Chrome/Application/chrome.exe";

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EXE, headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars"]
  });
  async function shot(name, vp, theme, y) {
    const page = await browser.newPage();
    await page.setViewport(vp);
    await page.goto(`http://localhost:8080/?theme=${theme}`, { waitUntil: "networkidle0", timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 800));
    await page.evaluate(py => window.scrollTo({ top: py, behavior: "instant" }), y);
    await new Promise(r => setTimeout(r, 1400));
    await page.screenshot({ path: `shots/${name}.png` });
    await page.close();
  }
  await shot("gallery-light", { width: 1440, height: 1050 }, "light", 1750);
  await shot("gallery-dark-mobile", { width: 375, height: 812 }, "dark", 2900);
  await shot("contact-light", { width: 1440, height: 1050 }, "light", 99999);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
