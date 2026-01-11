# Nodendo
Drag and drop Bootstrap editor software.

## Getting started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the desktop app:
   ```bash
   npm start
   ```

## Build a Windows EXE
1. Run the Windows packaging script:
   ```bash
   npm run dist:win
   ```
2. The installer EXE will be generated in the `dist/` folder (created by Electron Builder).

## Usage
- Drag components from the left panel onto the canvas.
- Click any block to edit its background, duplicate it, or move it.
- Edit text inline by clicking inside headings or paragraphs.
- Add custom CSS in the inspector to style the exported layout.
- Use **Download JSON** / **Import JSON** to save and reopen layouts.
- Click **Export HTML** to copy or download the generated Bootstrap layout.
- Click **Clear canvas** to reset the editor.
