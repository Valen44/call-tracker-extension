# Call Tracker

A browser extension designed to automatically track call metrics, earnings, and time for interpreters across multiple portals.

<p align="center">
    <img src="https://i.imgur.com/yjTb4gq.png" width="70%" height="70%" hspace="5" >
    <img src="https://i.imgur.com/veeSaXX.png" width="25%" height="25%" hspace="15" >
</p>

## Installation

Since this extension is not on the Chrome Web Store, you need to load it manually in Developer Mode. The instructions are for Chrome but you can use this extension on any chromium-based browser (I haven't tested Firefox)
1.  **Download the Extension**: [here](https://github.com/Valen44/call-tracker-extension/releases/latest)
    - Go to the **Releases** page of this repository.
    - Download the latest `call-tracker-extension-vX.X.X.zip` file.

2.  **Unzip the File**:
    - Extract the contents of the ZIP file into a folder on your computer. Make sure you remember where you saved this folder, as Chrome will need it.

3.  **Load the Extension in Chrome**:
    - Open Google Chrome and navigate to the extensions page by typing `chrome://extensions` in the address bar and pressing Enter.
    - In the top-right corner, toggle on **"Developer mode"**.
    - A new set of buttons will appear. Click on **"Load unpacked"**.
    - In the file selection dialog, navigate to and select the folder you unzipped in step 2.
    - The "Call Tracker" extension should now appear in your list of extensions and be ready to use!

## How to Use

1.  **Set Your Pay Rate**: After installing, click the extension icon in the Chrome toolbar to open the popup. Open the dashboard and then go to the **Settings** menu to configure your pay rate for each of the portals.
2.  **Use the Widget**: The Call Tracker widget will appear on the portal. You can click and drag its header to move it to a convenient spot. The widget shows the today's stats for the active portal.
3.  **Automatic Tracking**: The extension automatically detects your status changes. When your status becomes "On-Call", the timer starts. When the call ends, the stats update automatically.
4.  **View Reports**: Click the extension icon in your browser's toolbar to open the popup and the dashboard for more detailed reports and data management options.
    - The popup shows information about today's calls for the current portal and the total amount earned for the day across all portals.
    - The dashboards shows information about your calls across all portals. You can filter calls by date and company, allowing to see them in a table and a calendar. 
6.  **Manage your calls:** You can edit, delete and create new calls on the dashboard. You can also backup and restore calls.
7.  **Set a daily goal:** You can set a daily earnings goal. You can see your progress on the popup and you can choose your goal amount by going to the Settings meny on the dashboard

## How to add more Portals

The extension supports multiple interpreter portals. By default, two portals are already included: LSA and Propio. These are installed automatically and ready to use. Please remeber to change the default rate to your own rate.

If you want to add new portals, you can do so by importing a JSON file from:
`Dashboard → Settings → Portal Config`

**Important:**
Importing a JSON file replaces the existing portal configuration. If you want to add a new portal without losing LSA and Propio, you must include them in the JSON as well.
- To make this easier, a base JSON file containing the default portals is provided in the GitHub repository. You should copy that file and add new entries to it, rather than starting from scratch.

### Portal Configuration File

The file must be a JSON array, where each item represents one portal. Example and explanation:
```json
[
  {
    "companyName": "My Portal",
    "payRate": 0.20,
    "color": "#00A86B",
    "portalConfig": {
      "portalLink": "https://example.com/portal",
      "selector": ".agent-status",
      "rounding": true,
      "validCallDuration": 90,
      "websiteTitleTimer": false,
      "keywords": {
        "available": ["Available"],
        "onCall": ["On Call"],
        "acw": ["Wrap-Up"],
        "unavailable": ["Offline"],
        "ringing": ["Ringing"]
      }
    }
  }
]
```
#### - Basic Information
- `companyName`: The name of the company or portal. This is shown in the dashboard and stats overlay.
- `payRate`: How much you earn per minute for calls on this portal.
- `color`: A color used to visually identify this portal in the UI (for example, the tracker header).

#### - Portal Settings `portalConfig`
- `portalLink`: The main URL of the portal.  It should be the complete link including *https://www....*
    The extension activates automatically when you visit a page that starts with this link.
- `selector`: This tells the extension **where to look on the page to read your status** (Available, On Call, etc.).

**How to find the selector**
1. Open the portal in your browser
2. Right-click on the status text (for example: “Available”)
3. Click **Inspect**
4. Look at the HTML element that contains the status text

If the element has:
- an **id**, use `#idName` 
- a **class**, use `.className`
    
Examples: `#span-agentstatus-text` or  `.call-status-text`

- `rounding`: If enabled, call duration is rounded to the nearest **30 seconds** before calculating earnings.
- `validCallDuration`: The minimum call length (in seconds) for a call to be considered valid automatically.
	- If a call is **shorter than this value**, a dialog will appear asking: “Was this call valid?”
	- This allows you to manually decide whether the call should be paid or not.
- `websiteTitleTimer`  If enabled, the call timer is shown in the browser tab title while you’re on a call. This is useful to see the call time in case the portal hides the widget when you are on a call (like Propio does)

#### - Status Keywords
The `keywords` section tells the extension how to understand your status based on the text shown on the website.

Each category can have **multiple possible texts**. Example: 
`"unavailable": ["Offline", "Rejected"]`

### State Flow (Very Important)

The extension follows a **fixed flow of states**. Unfortunately, **this flow cannot be changed**. Your portal **must follow this order** for tracking to work correctly.

#### - Main Flow

`Unavailable → Available → Ringing → On Call → ACW → Available`

#### - Allowed Shortcuts

`Available → Unavailable | Ringing → Unavailable (call rejected) | ACW → Unavailable`

If the portal changes state in a way that **does not match this flow**, the extension enters an **invalid state** and stops tracking.

To recover, you must manually go back to:
- **Unavailable**, or
- **Available**


