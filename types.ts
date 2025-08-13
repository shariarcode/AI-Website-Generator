export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface DailyLimit {
  count: number;
  date: string;
}

export interface ImageFile {
  data: string; // base64 data URL
  mimeType: string;
  name: string;
}
