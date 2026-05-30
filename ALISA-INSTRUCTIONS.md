# Little Beans Website — What Alisa Can Update

You can make changes to the website directly from the **Little Beans — Site Data** Google Sheet, without touching any code. Changes go live within a few seconds of saving.

---

## The Purple Announcement Bar

The bar at the very top of every page on the website — the one that says things like *"Berlin's own indoor play space! · Mon–Fri 9–4, Sat 9–2"*.

**To change it:**
1. Open the **Config** tab in the spreadsheet.
2. Find the row that says `announcement_bar` in the first column.
3. Click the cell next to it (column B) and type your new message.
4. Press Enter or click somewhere else to save. Done.

The website will show your new message within a few seconds for any visitor who loads or refreshes the page.

**Ideas for what to put there:**
- Seasonal hours (`Closing early for the holidays! · Dec 24 we close at noon`)
- Closure notices (`Closed this Saturday for a private event`)
- Fun announcements (`Now open 7 days a week! · Mon–Sun 9–4`)
- Regular message when nothing special is going on: `Berlin's own indoor play space! · Mon–Fri 9–4, Sat 9–2`

---

## Hours

The hours listed on the homepage and Open Play page.

**Default hours (no changes needed unless something is different):**
- Mon–Fri: 9:00am – 4:00pm
- Sat: 9:00am – 2:00pm
- Sun: Closed

**To change hours for a specific week:**
1. Open the **Weekly Hours** tab.
2. Add a new row at the bottom.
3. In the first column (**Week Of**), type the Monday of that week in this format: `2026-06-09`
   - To find the Monday: if the week you want starts on June 9, type `2026-06-09`.
4. Fill in the hours for each day of that week.
   - Use this format: `9:00am – 4:00pm` (or just type `Closed` for days you're closed).
   - Leave a cell blank if that day is the same as normal — blank cells use the default.
5. Save the sheet. The website will update automatically.

**You only need to add a row for weeks that are different.** You don't need to enter every single week — only the special ones. After that week passes, you can delete the row or leave it, either way is fine.

---

## Blocking Time Slots for Party Days

When you have a private party booked, you might want to hide those time slots from the public Open Play booking so no one tries to book on top of your party.

**To block a time slot:**
1. Open the **Open Play Schedule** tab.
2. Add a new row.
3. In the first column (**Date**), type the date in this format: `2026-06-14`
4. In the columns for the time slots you want to block, type anything — `Party` works great.
5. Leave the other time slots blank if they're still available.

**Example:** You have a party on June 14 that runs from 9am to 11am. You want to block the 9:00 AM and 10:00 AM slots but leave the rest open.

| Date | 9:00 AM | 10:00 AM | 11:00 AM | 12:00 PM | 1:00 PM | 2:00 PM or later |
|---|---|---|---|---|---|---|
| 2026-06-14 | Party | Party | | | | |

Anyone trying to book Open Play on June 14 will see 9:00 AM and 10:00 AM grayed out with "Unavailable." They can still pick any of the later slots.

**To unblock a slot:** Just delete the text from that cell (or delete the whole row if all slots are open again).

---

## Quick Tips

- **Changes go live in seconds** — no waiting, no approvals. Be confident!
- **You can't break anything** — if you make a typo, the website just falls back to its normal defaults. Fix it and save again.
- **Dates always go in YYYY-MM-DD format** — year first, then month, then day, with dashes. Example: June 14, 2026 = `2026-06-14`.
- **Hours format:** `9:00am – 4:00pm` (lowercase am/pm, dash in the middle). If you type it differently it'll still show up — it just might look a little different on the site.
- If you're ever unsure whether a change went through, just reload the website and check.

---

Questions? Contact Sheena.
