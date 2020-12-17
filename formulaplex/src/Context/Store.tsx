import produce from "immer";
import { createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { initStore, StoreState } from "../Types/Types";
import { generateId } from "../Util/Util";
import { ActionTypes } from "./ActionTypes";

const mainReducer = (
  state: StoreState = initStore,
  action: any
): StoreState => {
  switch (action.type) {
    case ActionTypes.PURGE: {
      return initStore;
    }

    case ActionTypes.SET_CURRENT_PROJECT: {
      return produce(state, (draft) => (draft.currentProjectId = action.value));
    }

    case ActionTypes.OPEN_WINDOW: {
      return produce(state, (draft) => {
        draft.windows.push({
          title: action.value.title,
          id: generateId(),
          routeName: action.value.routeName,
          height: action.value.height || 500,
          width: action.value.width || 600,
          params: action.value.pararms || {},
          x: 100,
          y: 100,
        });
      });
    }

    case ActionTypes.SET_PATTERNS: {
      return produce(state, (draft) => {
        draft.patterns = action.value;
      });
    }

    case ActionTypes.SET_RECORDING_MELODY: {
      return produce(state, (draft) => {
        draft.recordingMelody = action.value;
      });
    }

    case ActionTypes.SET_CURRENT_KEYS: {
      return produce(state, (draft) => {
        draft.currentKeys = action.value;
      });
    }

    case ActionTypes.UPDATE_CURRENT_PROJECT: {
      return produce(state, (draft) => {
        if (draft.currentProjectId) {
          let project = draft.projects.find(
            (x) => x.id === draft.currentProjectId
          );
          if (project) {
            project = { ...project, ...action.value };
          }
        }
      });
    }

    case ActionTypes.SET_WINDOWS: {
      return produce(state, (draft) => {
        draft.windows = action.value;
      });
    }

    case ActionTypes.SET_PROJECTS: {
      return produce(state, (draft) => {
        draft.projects = action.value;
      });
    }

    case ActionTypes.SET_CURRENT_SYNTH: {
      return produce(state, (draft) => {
        draft.currentSynth = action.value;
      });
    }

    case ActionTypes.SET_MELODIES: {
      return produce(state, (draft) => {
        draft.melodies = action.value;
      });
    }

    case ActionTypes.SET_PATTERN_PLAYERS: {
      return produce(state, (draft) => {
        draft.patternPlayers = action.value;
      });
    }

    case ActionTypes.SET_IS_RECORDING_MELODY: {
      return produce(state, (draft) => {
        draft.isRecordingMelody = action.value;
      });
    }

    case ActionTypes.SET_INSTRUMENTS: {
      return produce(state, (draft) => {
        draft.instruments = action.value;
      });
    }

    case ActionTypes.SET_TIMED_MELODIES: {
      return produce(state, (draft) => {
        draft.timedMelodies = action.value;
      });
    }

    case ActionTypes.SET_SELECTED_INSTRUMENT_ID: {
      return produce(state, (draft) => {
        draft.selectedInstrumentId = action.value;
      });
    }

    case ActionTypes.SET_SELECTED_MELODY_ID: {
      return produce(state, (draft) => {
        draft.selectedMelodyId = action.value;
      });
    }

    case ActionTypes.SET_SELECTED_PATTERN_ID: {
      return produce(state, (draft) => {
        draft.selectedPatternId = action.value;
      });
    }

    case ActionTypes.SET_SELECTED_TIMED_MELODY_ID: {
      return produce(state, (draft) => {
        draft.selectedTimedMelodyId = action.value;
      });
    }

    default: {
      console.log(`${action.type} as not handled by any reducer`);
      return state;
    }
  }
};

const config = {
  key: "v3",
  storage,
  blacklist: [],
};

const rootReducer = persistReducer(config, mainReducer);

const store = createStore(rootReducer);

const persistor = persistStore(store);

export { persistor, store };
