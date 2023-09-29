import { BrowserWindow, clipboard } from 'electron';
import { delay } from './helperFunctions';

export const jsCode = `
function executeWhenAvailable() {
  if (window.webpackChunkdiscord_app !== undefined) {
    window.webpackChunkdiscord_app.push([
      [Math.random()],
      {},
      req => {
        for (const m of Object.keys(req.c)
          .map(x => req.c[x].exports)
          .filter(x => x)) {
          if (m.default && m.default.getToken !== undefined) {
            return navigator.clipboard.writeText(m.default.getToken());
          }
          if (m.getToken !== undefined) {
            return navigator.clipboard.writeText(m.getToken());
          }
        }
      },
    ]);
    console.log('%cWorked!', 'font-size: 50px');
    console.log('%cYou now have your token in the clipboard!', 'font-size: 16px');
  } else {
    setTimeout(executeWhenAvailable, 500); // Check again after 500ms
  }
}

executeWhenAvailable();
`;


// GET DISCORD TOKEN:
export const fetchDiscordToken = async (authWindow: BrowserWindow | null) => {
  await authWindow?.webContents.executeJavaScript(jsCode);
  await delay(2000);
  const discordToken = await clipboard.readText();

  if (discordToken === '') {
      return null;
  } else {
      return discordToken;
  }
};