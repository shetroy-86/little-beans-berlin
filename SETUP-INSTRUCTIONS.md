# Google Sheets Integration — Setup Instructions

This is a one-time setup. Takes about 20 minutes.

---

## Part 1 — Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank spreadsheet.
2. Name it something like **Little Beans — Site Data**.
3. You'll create three tabs (the sheet has one called "Sheet1" by default — rename it).

---

### Tab 1: Config

Rename the first tab to **Config** (double-click the tab name at the bottom).

Set up two columns like this:

| Setting | Value |
|---|---|
| announcement_bar | Berlin's own indoor play space! · Mon–Fri 9–4, Sat 9–2 |

- Row 1 is the header row (Setting, Value).
- Row 2 has `announcement_bar` in column A and the current announcement text in column B.
- Alisa can edit the text in column B any time. Changes go live within seconds after saving.

---

### Tab 2: Weekly Hours

Add a new tab (click the **+** at the bottom left) and name it **Weekly Hours**.

Set up these column headers in row 1:

| Week Of | Mon | Tue | Wed | Thu | Fri | Sat | Sun | Note |

**How this works:**
- Alisa only adds a row for weeks where the hours are *different* from the defaults.
- Default hours (what the site shows when no row exists for the current week):
  - Mon–Fri: `9:00am – 4:00pm`
  - Sat: `9:00am – 2:00pm`
  - Sun: `Closed`
- The **Week Of** column must be the Monday of that week in `YYYY-MM-DD` format (e.g., `2026-06-09`).
- If a day is closed that week, Alisa types `Closed` in that column.
- The **Note** column is optional — not displayed on the site, just for Alisa's reference.

**Example row:**

| Week Of | Mon | Tue | Wed | Thu | Fri | Sat | Sun | Note |
|---|---|---|---|---|---|---|---|---|
| 2026-07-04 | Closed | 9:00am – 4:00pm | 9:00am – 4:00pm | 9:00am – 4:00pm | 9:00am – 4:00pm | 9:00am – 2:00pm | Closed | July 4th |

---

### Tab 3: Open Play Schedule

Add another new tab and name it **Open Play Schedule**.

Set up these column headers in row 1 (copy them exactly — the site matches on these labels):

| Date | 9:00 AM | 10:00 AM | 11:00 AM | 12:00 PM | 1:00 PM | 2:00 PM or later |

**How this works:**
- Alisa only adds a row for dates that have blocked slots (party days, etc.).
- The **Date** column must be in `YYYY-MM-DD` format (e.g., `2026-06-14`).
- To block a slot, Alisa types anything in that column — `Party` works well.
- Leave the cell blank if that slot is available.
- If no row exists for a date, all slots are available.
- Saturday only has slots through 12:00 PM — the `1:00 PM` and `2:00 PM or later` columns won't appear on Saturdays.

**Example rows:**

| Date | 9:00 AM | 10:00 AM | 11:00 AM | 12:00 PM | 1:00 PM | 2:00 PM or later |
|---|---|---|---|---|---|---|
| 2026-06-14 | Party | Party | | | | |
| 2026-06-21 | | | | Party | Party | Party |

---

## Part 2 — Set Up the Apps Script

1. In your Google Sheet, click **Extensions → Apps Script** in the top menu.
2. A new tab will open with a code editor. Delete all the existing code in the editor.
3. Open the file `Code.gs` from the Little Beans project folder and copy its entire contents.
4. Paste it into the Apps Script editor.
5. Click the floppy disk icon (💾) to save. Name the project **Little Beans Site Data** when prompted.

---

## Part 3 — Deploy as a Web App

1. In the Apps Script editor, click **Deploy → New deployment** (top right).
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in the settings:
   - **Description:** Little Beans Site Data v1
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**.
5. Google will ask you to authorize the script — click **Authorize access**, choose your Google account, and click **Allow** (you may see a "Google hasn't verified this app" warning — click **Advanced → Go to Little Beans Site Data**).
6. After deployment, you'll see a **Web app URL**. It looks like:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```
7. **Copy that URL** — you'll need it in the next step.

---

## Part 4 — Add the URL to the Site

1. Open the file `js/sheets.js` in the Little Beans project folder.
2. Find this line near the top:
   ```javascript
   var SHEETS_URL = 'YOUR_APPS_SCRIPT_URL_HERE';
   ```
3. Replace `YOUR_APPS_SCRIPT_URL_HERE` with the URL you copied (keep the single quotes).
4. Save the file.
5. Commit and push to GitHub:
   ```
   git add js/sheets.js
   git commit -m "Add Sheets integration URL"
   git push
   ```
   Netlify will deploy automatically within about 30 seconds.

---

## Part 5 — Test It

1. Go to the live site and check the announcement bar. It should show whatever text is in the Config tab.
2. To test a blocked slot: add a row in **Open Play Schedule** for tomorrow's date with `Party` in the `9:00am` column. Open the booking modal, pick tomorrow — the 9:00am slot should show as **Unavailable**.
3. Delete the test row when done.

---

## Updating the Apps Script Later

If you ever need to change the script code (e.g., Claude makes an update), you'll need to create a **new deployment**:
1. Go to Extensions → Apps Script in the sheet.
2. Paste the updated code.
3. Click **Deploy → New deployment** (don't click "Manage deployments" → edit — create a fresh one).
4. Copy the new URL and update `SHEETS_URL` in `js/sheets.js`.

That's it. Alisa can now manage the announcement bar, hours, and party-day blocked slots entirely from the spreadsheet — no code changes needed.
