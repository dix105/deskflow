import { Action, ActionPanel, Clipboard, Detail, Form, getPreferenceValues, Icon, showToast, Toast } from "@raycast/api";
import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { useState } from "react";
import { applyCorrections, buildVocabularyPrompt, getGlossary, makeId, saveTranscript } from "./storage";

type Preferences = {
  groqApiKey?: string;
  transcriptionModel?: string;
};

type Values = {
  audio: string[];
  saveToMemory: boolean;
};

export default function Command() {
  const [result, setResult] = useState("");
  const [source, setSource] = useState("");

  async function handleSubmit(values: Values) {
    const audioPath = values.audio?.[0];
    if (!audioPath) {
      await showToast({ style: Toast.Style.Failure, title: "Choose an audio file" });
      return;
    }

    const { groqApiKey, transcriptionModel } = getPreferenceValues<Preferences>();
    if (!groqApiKey) {
      await showToast({ style: Toast.Style.Failure, title: "Add Groq API key in FlowDesk preferences" });
      return;
    }

    await showToast({ style: Toast.Style.Animated, title: "FlowDesk is transcribing…" });
    const glossary = await getGlossary();
    const rawText = await transcribeWithGroq(
      groqApiKey,
      transcriptionModel || "whisper-large-v3-turbo",
      audioPath,
      buildVocabularyPrompt(glossary),
    );
    const text = applyCorrections(rawText, glossary.corrections);
    const fileName = basename(audioPath);

    if (values.saveToMemory) {
      await saveTranscript({ id: makeId(), text, source: fileName, createdAt: new Date().toISOString() });
    }

    setSource(fileName);
    setResult(text || "No text returned.");
    await showToast({ style: Toast.Style.Success, title: "Transcription ready" });
  }

  if (result) {
    return (
      <Detail
        markdown={`# FlowDesk transcript\n\n**Source:** ${source}\n\n---\n\n${result}`}
        actions={
          <ActionPanel>
            <Action.CopyToClipboard title="Copy Transcript" content={result} />
            <Action.Paste title="Paste Transcript" content={result} />
            <Action title="Copy and Transcribe Another" icon={Icon.Clipboard} onAction={async () => { await Clipboard.copy(result); setResult(""); setSource(""); }} />
            <Action.Open title="Edit Words Glossary" target="raycast://extensions/dix105/flowdesk-raycast/words-glossary" />
            <Action.Open title="Open Transcript Memory" target="raycast://extensions/dix105/flowdesk-raycast/transcript-memory" />
          </ActionPanel>
        }
      />
    );
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm icon={Icon.Microphone} title="Transcribe" onSubmit={handleSubmit} />
          <Action.Open title="Edit Words Glossary" target="raycast://extensions/dix105/flowdesk-raycast/words-glossary" />
          <Action.Open title="Open Transcript Memory" target="raycast://extensions/dix105/flowdesk-raycast/transcript-memory" />
        </ActionPanel>
      }
    >
      <Form.Description text="FlowDesk for Raycast transcribes audio files with Groq Whisper, then applies your Words Glossary and correction rules. Raycast extensions cannot directly start microphone recording, so choose a recorded audio file here." />
      <Form.FilePicker id="audio" title="Recording" allowMultipleSelection={false} />
      <Form.Checkbox id="saveToMemory" title="Memory" label="Save transcript" defaultValue />
    </Form>
  );
}

async function transcribeWithGroq(apiKey: string, model: string, audioPath: string, prompt: string) {
  const bytes = await readFile(audioPath);
  const form = new FormData();
  form.append("file", new Blob([bytes]), basename(audioPath));
  form.append("model", model);
  form.append("response_format", "json");
  if (prompt) form.append("prompt", prompt.slice(0, 900));

  const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });

  if (!response.ok) throw new Error(`Groq transcription error ${response.status}`);
  const data = (await response.json()) as { text?: string };
  return data.text?.trim() || "";
}
