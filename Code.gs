// ============================================================
//  Little Beans Berlin — Google Apps Script
//  Paste this entire file into the Apps Script editor,
//  then deploy as a web app (see SETUP-INSTRUCTIONS.md).
// ============================================================

function doGet(e) {
  var result = {};

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // ── Tab 1: Config ──────────────────────────────────────────────────────
    // Returns the value of the "announcement_bar" row.
    try {
      var cfg  = ss.getSheetByName('Config');
      var rows = cfg.getDataRange().getValues();
      for (var i = 0; i < rows.length; i++) {
        if (String(rows[i][0]).trim() === 'announcement_bar') {
          result.announcement_bar = String(rows[i][1] || '').trim();
          break;
        }
      }
    } catch (err) {
      result.announcement_bar = '';
    }

    // ── Tab 2: Weekly Hours ────────────────────────────────────────────────
    // Finds the row for the current week's Monday (YYYY-MM-DD).
    // If no row exists, returns null and the site uses hardcoded defaults.
    try {
      var tz      = Session.getScriptTimeZone();
      var now     = new Date();
      var dow     = now.getDay(); // 0=Sun, 1=Mon …
      var diff    = (dow === 0) ? -6 : 1 - dow;
      var monday  = new Date(now.getTime() + diff * 86400000);
      var monStr  = Utilities.formatDate(monday, tz, 'yyyy-MM-dd');

      var hSheet  = ss.getSheetByName('Weekly Hours');
      var hData   = hSheet.getDataRange().getValues();
      result.weekly_hours = null;

      for (var r = 1; r < hData.length; r++) {
        var row     = hData[r];
        var weekOf  = row[0];
        var weekStr = (weekOf instanceof Date)
          ? Utilities.formatDate(weekOf, tz, 'yyyy-MM-dd')
          : String(weekOf).trim();
        if (weekStr === monStr) {
          result.weekly_hours = {
            mon: String(row[1] || '').trim(),
            tue: String(row[2] || '').trim(),
            wed: String(row[3] || '').trim(),
            thu: String(row[4] || '').trim(),
            fri: String(row[5] || '').trim(),
            sat: String(row[6] || '').trim(),
            sun: String(row[7] || '').trim(),
            note: String(row[8] || '').trim()
          };
          break;
        }
      }
    } catch (err) {
      result.weekly_hours = null;
    }

    // ── Tab 3: Open Play Schedule ──────────────────────────────────────────
    // Returns a map of { "YYYY-MM-DD": { "9:00am": "blocked", … } }
    // Only dates that have at least one blocked slot appear in the map.
    // Header row must be: Date | 9:00am | 10:30am | 12:00pm | 2:00pm
    try {
      var tz2     = Session.getScriptTimeZone();
      var sSheet  = ss.getSheetByName('Open Play Schedule');
      var sData   = sSheet.getDataRange().getValues();
      var headers = sData[0]; // ["Date","9:00am","10:30am","12:00pm","2:00pm"]
      var blocked = {};

      for (var s = 1; s < sData.length; s++) {
        var sRow = sData[s];
        if (!sRow[0]) continue;
        var dVal  = sRow[0];
        var dStr  = (dVal instanceof Date)
          ? Utilities.formatDate(dVal, tz2, 'yyyy-MM-dd')
          : String(dVal).trim();
        var slots = {};
        var any   = false;
        for (var c = 1; c < headers.length; c++) {
          if (String(sRow[c] || '').trim() !== '') {
            slots[String(headers[c]).trim()] = 'blocked';
            any = true;
          }
        }
        if (any) blocked[dStr] = slots;
      }
      result.blocked_slots = blocked;
    } catch (err) {
      result.blocked_slots = {};
    }

  } catch (outerErr) {
    result.error = outerErr.toString();
  }

  var out = ContentService.createTextOutput(JSON.stringify(result));
  out.setMimeType(ContentService.MimeType.JSON);
  return out;
}
