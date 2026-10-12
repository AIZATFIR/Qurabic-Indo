/**
 * Web Speech Synthesis Integration for Indonesian Quran Translation
 * Powers Tadarus Handsfree Mode in Qurabic-Indo
 */

export interface SpeechTranslationOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

/**
 * Cleans translation text so speech synthesis reads naturally:
 * - Strips HTML tags
 * - Strips footnote references e.g. [1], [2], (1)
 * - Cleans brackets, quotes, and excessive whitespace
 */
export function cleanTranslationForSpeech(text: string): string {
  if (!text) return '';

  return text
    // Remove HTML markup
    .replace(/<[^>]*>/g, ' ')
    // Remove footnote markers like [1], [23], [a]
    .replace(/\[\s*\w+\s*\]/g, ' ')
    // Remove parenthetical footnote numbers like (1), (2)
    .replace(/\(\s*\d+\s*\)/g, ' ')
    // Remove curly braces or bracket markers
    .replace(/[{}[\]]/g, ' ')
    // Remove quotation marks that might disrupt pauses
    .replace(/[""''`«»]/g, '')
    // Normalize punctuation spacing
    .replace(/\s+([.,;:!?])/g, '$1')
    // Remove rogue Arabic characters if accidentally embedded
    .replace(/[\u0600-\u06FF]/g, '')
    // Collapse multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks if Web Speech API is supported in current environment
 */
export function isSpeechSynthesisSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.SpeechSynthesisUtterance !== 'undefined'
  );
}

/**
 * Finds Indonesian voice from system voices if available
 */
export function getIndonesianVoice(): SpeechSynthesisVoice | null {
  if (!isSpeechSynthesisSupported()) return null;

  try {
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // Prefer exact id-ID match
    const exactMatch = voices.find(
      (v) => v.lang === 'id-ID' || v.lang === 'id_ID'
    );
    if (exactMatch) return exactMatch;

    // Fallback to any voice starting with 'id'
    const idPrefix = voices.find((v) => v.lang.toLowerCase().startsWith('id'));
    if (idPrefix) return idPrefix;

    // Fallback to voice with Indonesian in its name
    const nameMatch = voices.find((v) =>
      v.name.toLowerCase().includes('indonesia')
    );
    if (nameMatch) return nameMatch;

    return null;
  } catch {
    return null;
  }
}

/**
 * Speaks Indonesian translation of an Ayah using SpeechSynthesisUtterance
 */
export function speakIndonesianTranslation(
  text: string,
  options: SpeechTranslationOptions = {}
): SpeechSynthesisUtterance | null {
  if (!isSpeechSynthesisSupported()) {
    options.onError?.(new Error('Speech synthesis is not supported'));
    return null;
  }

  const cleaned = cleanTranslationForSpeech(text);
  if (!cleaned) {
    options.onEnd?.();
    return null;
  }

  try {
    // Cancel any previous utterance to prevent queue pile-up
    window.speechSynthesis.cancel();

    const utterance = new window.SpeechSynthesisUtterance(cleaned);
    utterance.lang = 'id-ID';
    utterance.rate = options.rate ?? 0.95; // Calm, respectful pace for Quranic translation
    utterance.pitch = options.pitch ?? 1.0;
    utterance.volume = options.volume ?? 1.0;

    const indonesianVoice = getIndonesianVoice();
    if (indonesianVoice) {
      utterance.voice = indonesianVoice;
    }

    if (options.onStart) {
      utterance.onstart = () => options.onStart?.();
    }

    utterance.onend = () => {
      options.onEnd?.();
    };

    utterance.onerror = (e) => {
      // In Chromium, cancelling speech triggers an 'interrupted' or 'canceled' error, which is benign
      if (e.error === 'interrupted' || e.error === 'canceled') {
        return;
      }
      options.onError?.(e);
    };

    window.speechSynthesis.speak(utterance);
    return utterance;
  } catch (err) {
    options.onError?.(err);
    return null;
  }
}

/**
 * Immediately cancels any active speech synthesis
 */
export function cancelSpeechSynthesis(): void {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }
}

/**
 * Pauses active speech synthesis
 */
export function pauseSpeechSynthesis(): void {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.pause();
    } catch {
      // Ignore
    }
  }
}

/**
 * Resumes paused speech synthesis
 */
export function resumeSpeechSynthesis(): void {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.resume();
    } catch {
      // Ignore
    }
  }
}
