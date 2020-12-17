import {
  Instrument,
  Melody,
  Pattern,
  Project,
  StoreState,
  TimedMelody,
} from "../Types/Types";
export const selectProject = (state: StoreState): Project | undefined => {
  return state.currentProjectId
    ? state.projects.find((x) => x.id === state.currentProjectId)
    : undefined;
};

export const selectPatterns = (state: StoreState) => {
  return state.patterns;
};

export const selectPattern = (id: string) => (
  state: StoreState
): Pattern | undefined => {
  return state.patterns.find((x) => x.id === id);
};

export const selectSelectedInstrument = (
  state: StoreState
): Instrument | undefined => {
  return state.instruments.find((x) => x.id === state.selectedInstrumentId);
};

export const selectSelectedTimedMelody = (
  state: StoreState
): TimedMelody | undefined => {
  return state.timedMelodies.find((x) => x.id === state.selectedTimedMelodyId);
};

export const selectSelectedMelody = (state: StoreState): Melody | undefined => {
  return state.melodies.find((x) => x.id === state.selectedMelodyId);
};

export const selectSelectedPatternId = (state: StoreState) =>
  state.selectedPatternId;

export const selectCurrentSynth = (state: StoreState) => state.currentSynth;
export const selectIsRecordingMelody = (state: StoreState) =>
  state.isRecordingMelody;

export const selectRecordingMelody = (state: StoreState) =>
  state.recordingMelody;

export const selectCurrentKeys = (state: StoreState) => state.currentKeys;

export const selectProjectPitch = (state: StoreState) =>
  selectProject(state)?.pitch;

export const selectWindows = (state: StoreState) => state.windows;
export const selectInstruments = (state: StoreState) => state.instruments;

export const selectTimedMelodies = (state: StoreState) => state.timedMelodies;
export const selectMelodies = (state: StoreState) => state.melodies;

export const selectPatternPlayers = (state: StoreState) => state.patternPlayers;
export const selectSelectedMelodyId = (state: StoreState) =>
  state.selectedMelodyId;
export const selectSelectedTimedMelodyId = (state: StoreState) =>
  state.selectedTimedMelodyId;
export const selectSelectedInstrumentId = (state: StoreState) =>
  state.selectedInstrumentId;
