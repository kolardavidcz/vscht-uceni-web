export type WorksheetItem = {
  id: string;
  name: string;
  type?: string;
  description?: string;
  correctEmojis: string[];
  hint?: string;
  children?: WorksheetItem[];
  checked?: boolean;
  groups?: {
    id: string;
    label: string;
    correctEmojis: string[];
  }[];
};

export type EmojiOption = {
  emoji: string;
  label: string;
  category: string;
};
