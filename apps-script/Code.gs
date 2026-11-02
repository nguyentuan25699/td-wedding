// RSVP endpoint: appends one row per submission to the Google Sheet.
// Setup (once):
//   1. Create a Google Sheet, rename its first tab to "RSVP", and put this header in row 1:
//      STT | Thời gian | Họ và tên | Số điện thoại | Tham dự | Số người | Khách của | Lời nhắn
//   2. Extensions > Apps Script: paste this file.
//   3. Project Settings > Script Properties: add SHEET_ID = the id in the sheet's URL.
//   4. Deploy > New deployment > Web app: Execute as Me, Who has access: Anyone. Copy the /exec URL into config.js (rsvp.url).

const SHEET_NAME = 'RSVP';
const MESSAGE_MAX = 1000;

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.website) return reply({ ok: true }); // honeypot: pretend success, store nothing
    const sheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID'))
      .getSheetByName(SHEET_NAME);
    sheet.appendRow([
      sheet.getLastRow(), // header is row 1, so the first guest gets 1
      new Date(),
      safeCell(data.name, 40),
      '',
      data.attend === 'no' ? 'Không' : 'Có',
      Math.min(10, Math.max(1, parseInt(data.count, 10) || 1)),
      data.guestOf === 'groom' ? 'Nhà trai' : 'Nhà gái',
      safeCell(data.message, MESSAGE_MAX)
    ]);
    // Phone goes in after the row: as plain text, so Sheets keeps the leading 0 (appendRow turns it into a number)
    sheet.getRange(sheet.getLastRow(), 4)
      .setNumberFormat('@')
      .setValue(String(data.phone == null ? '' : data.phone).trim().slice(0, 15));
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false });
  }
}

// Trims and caps the text. A value starting with = + - @ gets a leading apostrophe, so Sheets never runs it as a formula.
function safeCell(value, max) {
  const text = String(value == null ? '' : value).trim().slice(0, max);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
