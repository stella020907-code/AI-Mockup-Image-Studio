export interface MockupTemplate {
  id: string;
  name: string;
  url: string;
}

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

export interface ImageData {
  data: string;
  mimeType: string;
}
