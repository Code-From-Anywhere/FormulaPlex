import {
  Instrument,
  Key,
  Melody,
  Pattern,
  PatternPlayersPerPattern,
  Project,
  Sample,
  ScreenWindow,
  TimedMelody,
} from "../Types/Types";
import { ActionTypes } from "./ActionTypes";

export const actionOpenWindow = (window: string) => {
  return { type: ActionTypes.OPEN_WINDOW, value: window };
};

export const actionSetWindows = (windows: ScreenWindow[]) => {
  return { type: ActionTypes.SET_WINDOWS, value: windows };
};
export const actionSetCurrentProject = (project: string) => {
  return { type: ActionTypes.SET_CURRENT_PROJECT, value: project };
};

export const actionSetPatterns = (patterns: Pattern[]) => {
  return { type: ActionTypes.SET_PATTERNS, value: patterns };
};

export const actionSetRecordingMelody = (melody: Melody | null) => {
  return { type: ActionTypes.SET_RECORDING_MELODY, value: melody };
};

export const actionSetCurrentKeys = (keys: Key[]) => {
  return { type: ActionTypes.SET_CURRENT_KEYS, value: keys };
};

export const actionSetCurrentSynth = (sample: Sample) => {
  return { type: ActionTypes.SET_CURRENT_SYNTH, value: sample };
};

export const actionSetInstruments = (instruments: Instrument[]) => {
  return { type: ActionTypes.SET_INSTRUMENTS, value: instruments };
};

export const actionSetIsRecordingMelody = (value: boolean) => {
  return { type: ActionTypes.SET_IS_RECORDING_MELODY, value };
};

export const actionSetMelodies = (melodies: Melody[]) => {
  return { type: ActionTypes.SET_MELODIES, value: melodies };
};

export const actionSetPatternPlayers = (
  patternPlayers: PatternPlayersPerPattern
) => {
  return { type: ActionTypes.SET_PATTERN_PLAYERS, value: patternPlayers };
};

export const actionSetTimedMelodies = (timedMelodies: TimedMelody[]) => {
  return { type: ActionTypes.SET_TIMED_MELODIES, value: timedMelodies };
};

export const actionSetSelectedTimedMelodyId = (id: string | null) => {
  return { type: ActionTypes.SET_SELECTED_TIMED_MELODY_ID, value: id };
};

export const actionSetSelectedMelodyId = (id: string | null) => {
  return { type: ActionTypes.SET_SELECTED_MELODY_ID, value: id };
};

export const actionSetSelectedInstrumentId = (id: string | null) => {
  return { type: ActionTypes.SET_SELECTED_INSTRUMENT_ID, value: id };
};

export const actionSetSelectedPatternId = (id: string | null) => {
  return { type: ActionTypes.SET_SELECTED_PATTERN_ID, value: id };
};

export const actionSetProject = (
  key: keyof Project,
  value: Project[keyof Project]
) => {
  return { type: ActionTypes.UPDATE_CURRENT_PROJECT, value: { key, value } };
};
