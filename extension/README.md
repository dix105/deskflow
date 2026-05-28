# FlowDesk Raycast Extension

A simple standalone Raycast extension for FlowDesk transcription. Users do **not** need the FlowDesk desktop app.

## Main workflow

1. Open **FlowDesk** in Raycast.
2. Choose a recorded audio file.
3. Press **Transcribe**.
4. Copy, paste, or save the transcript.

The extension uses:

- Groq Whisper transcription
- FlowDesk Words Glossary
- Auto-correction rules
- Transcript Memory

## Important limitation

Raycast extensions do not currently expose a microphone recording API, so this extension cannot directly start/stop recording from code. For true press-hotkey-record-paste behavior, use the FlowDesk desktop app. This Raycast extension is for users who already have recordings/audio files and want the FlowDesk transcription flow inside Raycast.

## Setup

Add a Groq API key in Raycast preferences for this extension.
