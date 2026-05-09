"use client";

import { useState, useTransition } from "react";
import { saveReflection } from "@/app/actions";

type Props = {
  chapterId: number;
  question: string;
  initial: string;
};

export default function ReflectionForm({ chapterId, question, initial }: Props) {
  const [text, setText] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [isEditing, setIsEditing] = useState(!initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Write at least a sentence before saving.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await saveReflection(chapterId, trimmed);
      if (result.ok) {
        setSaved(trimmed);
        setIsEditing(false);
      } else {
        setError(result.error === "too-long" ? "Reflection is too long (max 2000 characters)." : "Could not save. Try again.");
      }
    });
  };

  const cancel = () => {
    setText(saved);
    setError(null);
    setIsEditing(false);
  };

  return (
    <section className="bg-secondary-fixed/15 border-2 border-secondary-fixed rounded-xl p-lg flex flex-col gap-md">
      <header className="flex items-center gap-2">
        <span
          className="material-symbols-outlined text-secondary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          self_improvement
        </span>
        <h2 className="font-headline-md text-[22px] text-primary">Your Reflection</h2>
      </header>

      <p className="font-body-lg text-[18px] text-on-surface leading-relaxed">{question}</p>

      {isEditing ? (
        <div className="flex flex-col gap-sm">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Take a moment. Write what you noticed, what you wondered, or what you'll remember…"
            rows={5}
            maxLength={2000}
            className="px-4 py-3 bg-surface rounded-xl border-2 border-secondary-fixed focus:border-primary focus:outline-none transition-colors font-body-lg text-on-surface resize-y"
          />
          <div className="flex items-center justify-between gap-sm flex-wrap">
            <div className="flex gap-sm flex-wrap">
              <button
                type="button"
                onClick={submit}
                disabled={pending || !text.trim()}
                className="bg-primary-container text-on-primary-container font-label-caps text-label-caps px-lg py-sm rounded-full hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                {pending ? "Saving…" : saved ? "Save changes" : "Save reflection"}
              </button>
              {saved && (
                <button
                  type="button"
                  onClick={cancel}
                  className="text-on-surface-variant font-label-caps text-label-caps px-md py-sm rounded-full hover:text-primary transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
            <span className="font-label-caps text-label-caps text-on-surface-variant/70">
              {text.length}/2000
            </span>
          </div>
          {error && (
            <p className="font-body-md text-error bg-error-container/40 rounded-lg p-sm">{error}</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-sm">
          <div className="bg-surface rounded-xl p-md border border-secondary-fixed">
            <p className="font-body-lg text-[17px] text-on-surface italic whitespace-pre-wrap leading-relaxed">
              “{saved}”
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="self-start text-secondary font-label-caps text-label-caps inline-flex items-center gap-1 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span> Edit reflection
          </button>
        </div>
      )}
    </section>
  );
}
