import { create } from "zustand";

type TModelStore = {
  modelState: unknown;
  modelNameHooks: string;
  materialState: string;
  fileXtenHooks: string;
  roomName: string;
  setSaveModel: (value: unknown) => void;
  setSaveModelNameHooks: (value: string) => void;
  setSaveMaterial: (value: string) => void;
  setSaveFileXtenHooks: (value: string) => void;
  setRoomName: (value: string) => void;
};

export const useModelStore = create<TModelStore>((set) => ({
  modelState: undefined,
  modelNameHooks: "",
  materialState: "",
  fileXtenHooks: "",
  roomName: "",
  setSaveModel: (value: unknown) =>
    set((state) => ({ modelState: (state.modelState = value) })),
  setSaveModelNameHooks: (value: string) =>
    set((state) => ({ modelNameHooks: (state.modelNameHooks = value) })),
  setSaveMaterial: (value: string) =>
    set((state) => ({ materialState: (state.materialState = value) })),
  setSaveFileXtenHooks: (value: string) =>
    set((state) => ({ fileXtenHooks: (state.fileXtenHooks = value) })),
  setRoomName: (value: string) =>
    set((state) => ({ roomName: (state.roomName = value) })),
}));
