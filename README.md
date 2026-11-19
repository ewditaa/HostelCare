# HostelCare - Hostel Complaint Management System (DBMS capstone prototype)

Pure HTML + CSS + JavaScript. No install, no build step.

## Run locally (VS Code)
1. Unzip/copy the `hostelcare` folder and open it in VS Code (File > Open Folder).
2. Install the **Live Server** extension, right-click `index.html` > **Open with Live Server**.
   - Or without extensions: open a terminal in the folder and run `python -m http.server 8000`, then visit http://localhost:8000
   - Double-clicking `index.html` also works.
3. Click **Login as Student** or **Login as Warden** (no real credentials needed).

## Files
- `index.html`, `style.css`, `app.js` - frontend (dark dashboard, student + warden views)
- `db.js` - mock backend: tables mirror `schema.sql` and are saved in the browser (localStorage)
- `schema.sql` - MySQL schema (Gayatri Hostel, Vivekanand Hostel; Hostels, Rooms, Users, Complaints, Assignments, Complaint_History + Notices, Outpasses, Maintenance_Tasks)

## Status
Demo data is browser-only. MySQL integration comes next: run `schema.sql`, add a Node/Express API, and swap the `DB.*` methods in `db.js` for `fetch('/api/...')` calls. "Reset demo data" is on the login screen.

## Theme & font
- Palette: Miami Nights (0F4953, F98E6E, CBF5EF, F9FCFB, FFCFD2). Use the **Light mode / Dark mode** button (top right, also on the login screen); the choice is remembered.
- Headlines use **Astralaga**. It is a paid font, so place your licensed file in `fonts/` as `Astralaga.woff2` (or .otf/.ttf). Until then Cormorant Garamond is used as a close stand-in.
- Demo data: student Aduita (roll 206, room 426, Gayatri Hostel), warden Sukriti Chauhan. If you ran v1 before, this version uses a fresh browser data store automatically.
