import { StoreState } from "../Types";
export const selectProject = (state: StoreState) => {
  console.log(state);

  return state.currentProjectId
    ? state.projects.find((x) => x.id === state.currentProjectId)
    : undefined;
};
