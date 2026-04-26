export interface EssayTask {
  id: string;
  title: string;
  type: string;
  content: string[];
  explanation: string;
}

export interface Note {
  id: string;
  text: string;
  color: string;
  used: boolean;
}
