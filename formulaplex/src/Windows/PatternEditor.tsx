import React from "react";
import { useDispatch, useSelector } from "react-redux";
import PatternChannel from "../Components/Smart/PatternChannel";
import { actionSetPatterns } from "../Context/Actions";
import {
  selectInstruments,
  selectPattern,
  selectPatterns,
  selectProjectPitch,
  selectSelectedPatternId,
  selectTimedMelodies,
} from "../Context/Selectors";
import { Instrument, Pattern, TimedMelody } from "../Types/Types";
import { Constants, makeIntOrZero, selectRandomEntry } from "../Util/Util";
const PatternEditor = () => {
  const dispatch = useDispatch();

  const selectedPatternId = useSelector(selectSelectedPatternId);
  const pattern = useSelector(selectPattern(selectedPatternId));
  const timedMelodies = useSelector(selectTimedMelodies);
  const patterns = useSelector(selectPatterns);

  const projectPitch = useSelector(selectProjectPitch);
  const instruments = useSelector(selectInstruments);

  const setPatterns = (patterns: Pattern[]) =>
    dispatch(actionSetPatterns(patterns));

  if (!pattern) return null;

  return (
    <div>
      <input
        type="text"
        value={pattern.name === null ? "Pattern" : pattern.name}
        onChange={(e) => {
          const newPattern = { ...pattern, name: e.target.value };
          setPatterns(
            patterns.map((x) => (x.id === pattern.id ? newPattern : x))
          );
        }}
        style={{ fontSize: 24 }}
      />
      Length:
      <input
        type="text"
        value={pattern.length}
        onChange={(e) => {
          const newPattern = {
            ...pattern,
            length: makeIntOrZero(e.target.value),
          };
          setPatterns(
            patterns.map((x) => (x.id === pattern.id ? newPattern : x))
          );
        }}
      />
      Quantization:
      <input
        type="text"
        value={pattern.quantization}
        onChange={(e) => {
          const newPattern = {
            ...pattern,
            quantization: makeIntOrZero(e.target.value),
          };
          setPatterns(
            patterns.map((x) => (x.id === pattern.id ? newPattern : x))
          );
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          overflowY: "scroll",
        }}
      >
        {pattern.channels.map((channel, index) => {
          const instrument = instruments.find(
            (x) => x.id === channel.instrumentId
          );
          const timedMelody = timedMelodies.find(
            (x) => x.id === channel.timedMelodyId
          );

          if (instrument && timedMelody) {
            return (
              <PatternChannel
                instrument={instrument}
                timedMelody={timedMelody}
                pitch={projectPitch || Constants.DEFAULT_PITCH}
                channel={channel}
                patternId={pattern.id}
                channelIndex={index}
              />
            );
          } else {
            return null;
          }
        })}

        <PatternChannel
          pitch={projectPitch || Constants.DEFAULT_PITCH}
          onClick={() => {
            const getRandomInstrumentId = () =>
              selectRandomEntry<Instrument>(instruments).id;
            const getRandomTimedMelodyId = () =>
              selectRandomEntry<TimedMelody>(timedMelodies).id;

            //add random instrument to pattern
            const newPattern: Pattern = {
              ...pattern,
              channels: pattern.channels.concat([
                {
                  isOn: true,
                  basePitch: 4,
                  outputMixerTrack: 1,
                  panning: 1,
                  velocity: 1,
                  instrumentId: getRandomInstrumentId(),
                  timedMelodyId: getRandomTimedMelodyId(),
                },
              ]),
            };
            setPatterns(
              patterns.map((p) => (p.id === pattern.id ? newPattern : p))
            );
          }}
        />
      </div>
    </div>
  );
};

export default PatternEditor;
