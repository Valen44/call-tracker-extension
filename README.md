# Call Tracker for LSA

A browser extension designed to automatically track call metrics, earnings, and time for interpreters.

<p>
    <img src="https://i.imgur.com/0EHNu62.png" width="70%" height="70%" hspace="5" >
    <img src="https://i.imgur.com/M6iC32h.png" width="25%" height="25%" hspace="15" >
</p>

## Installation

Since this extension is not on the Chrome Web Store, you need to load it manually in Developer Mode. The instructions are for Chrome but you can use this extension on any chromium based browser (I haven't tested Firefox)
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

## For Developers (Building from Source)

If you want to modify the code or build the extension yourself, follow these steps.

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Valen44/call-tracker-extension.git
    cd call-tracker-extension
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Build the Extension**:
    ```bash
    npm run build
    ```
    This command will create a `dist` folder in the project directory.

4.  **Load the Unpacked Extension**:
    - Follow step 3 from the Installation instructions above, but instead of selecting the folder you downloaded, select the `dist` folder that was just created.

## How to Use

1.  **Set Your Pay Rate**: After installing, click the extension icon in the Chrome toolbar to open the popup. Open the dashboard and then go to the **Settings** menu to configure your pay rate. By default it is set to $0.15/min
2.  **Use the Widget**: The Call Tracker widget will appear on the portal. You can click and drag its header to move it to a convenient spot.
3.  **Automatic Tracking**: The extension automatically detects your status changes. When your status becomes "On-Call", the timer starts. When the call ends, the stats update automatically.
4.  **View Reports**: Click the extension icon in your browser's toolbar to open the popup and the dashboard for more detailed reports and data management options.
5.  **Manage your calls:** You can edit, delete and create new calls on the dashboard. You can also backup and restore calls.
