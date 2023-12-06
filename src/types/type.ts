export type TAnnotationEditor = {
  id?: number;
  content?: string;
  status?: "Solved" | "Not Solved" | "In Progress";
  username?: string;
};

export type Annotation = {
  id?: number;
  username: string | undefined;
  title: string;
  content: string;
  user_id: string;
  room_id: string;
  anno_id: number;
  created?: string;
  status: "Not Solved" | "In Progress" | "Solved";
  position: { x: number; y: number; z: number };
  normal?: {
    x: number | undefined;
    y: number | undefined;
    z: number | undefined;
  };
};
