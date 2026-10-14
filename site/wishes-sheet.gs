// Google Apps Script — saves each wish as a row in a Google Sheet.
// Setup:
// 1. Create a Google Sheet. Add headers in row 1: Time | Code | Name | Wish
// 2. Extensions → Apps Script. Replace everything with this file. Save.
// 3. Deploy → New deployment → type "Web app".
//    Execute as: Me.  Who has access: Anyone.  → Deploy, authorise.
// 4. Copy the web-app URL (ends in /exec) into WISHES_URL in script.js.
// This file is NOT uploaded to Vercel; it lives only in Google.

function doPost(e) {
  const p = e.parameter || {};
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  sheet.appendRow([
    new Date(),
    String(p.code || '').slice(0, 40),
    String(p.name || '').slice(0, 60),
    String(p.wish || '').slice(0, 600),
  ]);
  return ContentService.createTextOutput('ok');
}
