import { ActionTypes } from "./ActionTypes";

export const actionOpenWindow = (window: string) => {
  return { type: ActionTypes.OPEN_WINDOW, value: window };
};
export const setCurrentProject = (project: string) => {
  return { type: ActionTypes.SET_CURRENT_PROJECT, value: project };
};
