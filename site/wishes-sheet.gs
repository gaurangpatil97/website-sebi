// Google Apps Script — saves each wish as a row in a Google Sheet.
// Setup:
// 1. Create a Google Sheet. Add headers in row 1: Name | Wish | Time
// 2. Extensions → Apps Script. Replace everything with this file. Save.
// 3. Deploy → New deployment → type "Web app".
//    Execute as: Me.  Who has access: Anyone.  → Deploy, authorise.
// 4. Copy the web-app URL (ends in /exec) into WISHES_URL in script.js.
// This file is NOT uploaded to Vercel; it lives only in Google.

function doPost(e) {
  const p = e.parameter || {};
  const name = String(p.name || '').trim().slice(0, 60);
  const wish = String(p.wish || '').slice(0, 600);
  const row = [name, wish, new Date()];

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    const last = sheet.getLastRow();
    // One row per name: overwrite if it exists. Unknown guests ("friend") always get a new row.
    if (name && name.toLowerCase() !== 'friend' && last > 1) {
      const names = sheet.getRange(2, 1, last - 1, 1).getValues();
      const i = names.findIndex(r => String(r[0]).trim().toLowerCase() === name.toLowerCase());
      if (i !== -1) {
        sheet.getRange(i + 2, 1, 1, 3).setValues([row]);
        return ContentService.createTextOutput('updated');
      }
    }
    sheet.appendRow(row);
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}
