export type dir = "lrt";

export interface WikiData {
  description: string;
  dir: dir;
  displaytitle: string
  extract: string;
  extract_html: string;
  lang: string;
  pageid: number;
  thumbnail?: {
    height: number;
    source: string;
    width: number;
  };
  timestamp: string;
  title: string;
}