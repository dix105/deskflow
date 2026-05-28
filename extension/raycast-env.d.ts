/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Groq API Key - Used for Whisper transcription and text polish. */
  "groqApiKey"?: string,
  /** Transcription Model - Groq audio transcription model used by Transcribe Audio File. */
  "transcriptionModel": "whisper-large-v3-turbo" | "whisper-large-v3" | "distil-whisper-large-v3-en",
  /** Polish Model - Groq chat model used by Polish Clipboard Text. */
  "polishModel": "llama-3.1-8b-instant" | "llama-3.3-70b-versatile" | "gemma2-9b-it"
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `index` command */
  export type Index = ExtensionPreferences & {}
  /** Preferences accessible in the `transcribe-audio` command */
  export type TranscribeAudio = ExtensionPreferences & {}
  /** Preferences accessible in the `words-glossary` command */
  export type WordsGlossary = ExtensionPreferences & {}
  /** Preferences accessible in the `polish-clipboard` command */
  export type PolishClipboard = ExtensionPreferences & {}
  /** Preferences accessible in the `transcript-memory` command */
  export type TranscriptMemory = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `index` command */
  export type Index = {}
  /** Arguments passed to the `transcribe-audio` command */
  export type TranscribeAudio = {}
  /** Arguments passed to the `words-glossary` command */
  export type WordsGlossary = {}
  /** Arguments passed to the `polish-clipboard` command */
  export type PolishClipboard = {}
  /** Arguments passed to the `transcript-memory` command */
  export type TranscriptMemory = {}
}

