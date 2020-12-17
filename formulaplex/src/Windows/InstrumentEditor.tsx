import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  actionSetCurrentSynth,
  actionSetInstruments,
  actionSetPatterns,
} from "../Context/Actions";
import {
  selectCurrentSynth,
  selectInstruments,
  selectPatterns,
  selectSelectedInstrument,
  selectSelectedTimedMelody,
} from "../Context/Selectors";
import { Pattern } from "../Types/Types";
import {
  Constants,
  generateColor,
  generateId,
  generateSynth,
} from "../Util/Util";

const InstrumentEditor = () => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const dispatch = useDispatch();
  const selectedInstrument = useSelector(selectSelectedInstrument);
  const selectedTimedMelody = useSelector(selectSelectedTimedMelody);
  const patterns = useSelector(selectPatterns);
  const instruments = useSelector(selectInstruments);
  const currentSynth = useSelector(selectCurrentSynth);

  const setInstruments = (instruments) =>
    dispatch(actionSetInstruments(instruments));

  const setPatterns = (patterns) => dispatch(actionSetPatterns(patterns));

  const setCurrentSynth = (synth) => dispatch(actionSetCurrentSynth(synth));

  return (
    <div>
      {selectedInstrument && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p>
            Instrument:{" "}
            <input
              type="text"
              value={
                selectedInstrument.name !== null
                  ? selectedInstrument.name
                  : "Instrument"
              }
              onChange={(e) => {
                const newInstrument = {
                  ...selectedInstrument,
                  name: e.target.value,
                };
                setInstruments(
                  instruments.map((p) =>
                    p.id === selectedInstrument.id ? newInstrument : p
                  )
                );
              }}
              style={{ fontSize: 24 }}
            />
          </p>
          <p>Type: {selectedInstrument.type}</p>
          <textarea
            key={`${selectedInstrument.id}TextArea`}
            style={{ height: 200 }}
            ref={textAreaRef}
            defaultValue={JSON.stringify(selectedInstrument.properties)}
          />
          <button
            onClick={() => {
              const newProperties = JSON.parse(
                textAreaRef.current?.value || "{}"
              );
              const newInstrument = {
                ...selectedInstrument,
                properties: newProperties,
              };
              setInstruments(
                instruments.map((p) =>
                  p.id === selectedInstrument.id ? newInstrument : p
                )
              );

              currentSynth.sample.dispose();

              setCurrentSynth({
                sample: generateSynth(selectedInstrument.type, newProperties),
                type: selectedInstrument.type,
              });
            }}
          >
            Apply
          </button>
        </div>
      )}

      {selectedInstrument && selectedTimedMelody && (
        <div>
          <button
            onClick={() => {
              const newPattern: Pattern = {
                id: generateId(),
                projectIds: [],
                color: generateColor(),
                velocity: 1,
                name: `${selectedTimedMelody.name || "Melody"} with ${
                  selectedInstrument.name || "Instrument"
                }`,
                channels: [
                  {
                    isOn: true,
                    instrumentId: selectedInstrument.id,
                    timedMelodyId: selectedTimedMelody.id,
                    basePitch: 4,
                    outputMixerTrack: 1,
                    panning: 1,
                    velocity: 1,
                  },
                ],
                length: Constants.DEFAULT_PATTERN_LENGTH,
                quantization: Constants.DEFAULT_PATTERN_QUANTIZATION,
              };
              setPatterns([...patterns, newPattern]);
            }}
          >
            Create Pattern from instrument {selectedInstrument.name} + timed
            melody {selectedTimedMelody.name}
          </button>
        </div>
      )}
    </div>
  );
};

export default InstrumentEditor;
