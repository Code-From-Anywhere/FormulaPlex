import { produce } from "immer";
import React from "react";
import { IoMdAdd } from "react-icons/io";
import { useSelector } from "react-redux";
import { selectProject } from "../Context/Selectors";
import {
  Channel,
  Instrument,
  Pattern,
  PatternPlayerPlayable,
  TimedMelody,
} from "../Types";
import { Constants, generatePatternPlayerPlayable } from "../Util";
import OnOffButton from "./OnOffButton";
import ScrollableNumberTextInput from "./ScrollableNumberTextInput";
import ScrollableWheelInput from "./ScrollableWheelInput";

const PatternChannel = ({
  instrument,
  timedMelody,
  pitch,
  channel,
  onClick,
  patternId,
  channelIndex,
  patterns,
  setPatterns,
}: {
  instrument?: Instrument;
  timedMelody?: TimedMelody;
  pitch: number;
  channel?: Channel;
  onClick?: () => void;
  patternId?: string;
  channelIndex?: number;
  patterns?: Pattern[];
  setPatterns?: React.Dispatch<React.SetStateAction<Pattern[]>>;
}) => {
  const project = useSelector(selectProject);
  if (!project) {
    return null;
  }

  const setChannel = (key: keyof Channel, value: Channel[keyof Channel]) => {
    if (patterns && patternId && channelIndex !== undefined && setPatterns) {
      setPatterns(
        produce(patterns, (draft) => {
          const pattern = draft.find((pattern) => pattern.id === patternId);
          if (pattern) {
            pattern.channels[channelIndex][key] = value as never;
          }
        })
      );
    }
  };
  const steps = new Array(project.beatsPerBar * project.stepsPerBeat)
    .fill(0)
    .map((x, index) => index);

  console.log(steps);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ minWidth: 100 }}>
        {channel ? (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <OnOffButton
              value={channel.isOn}
              onChange={(value) => setChannel("isOn", value)}
            />
            <ScrollableWheelInput
              value={channel.basePitch}
              onChange={(value) => setChannel("basePitch", value)}
              minValue={Constants.MINIMAL_PITCH}
              maxValue={Constants.MAXIMUM_PITCH}
            />
            <ScrollableWheelInput
              value={channel.velocity}
              onChange={(value) => setChannel("velocity", value)}
            />

            <ScrollableNumberTextInput
              value={channel.outputMixerTrack}
              onChange={(value) => setChannel("outputMixerTrack", value)}
              minValue={1}
              maxValue={Constants.NUM_MIXER_TRACKS}
            />
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minWidth: 150,
          border: "1px solid black",
          borderRadius: 3,
          margin: 5,
          backgroundColor: instrument?.color,
          color: "white",
          textAlign: "center",
        }}
      >
        {instrument ? (
          instrument.name || "Instrument"
        ) : (
          <IoMdAdd size={24} color="black" onClick={onClick} />
        )}
      </div>
      {timedMelody && (
        <div
          style={{
            position: "relative",
            height: 40,
          }}
        >
          {steps.map((step) => {
            const left = step * Constants.STEP_WIDTH;
            const width = Constants.STEP_WIDTH;

            return (
              <span
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  backgroundColor: "#CCC",
                  position: "absolute",
                  top: 0,
                  height: 40,
                  left,
                  width,
                  border: "1px solid black",
                }}
              ></span>
            );
          })}
          {generatePatternPlayerPlayable(timedMelody, pitch, 1).map(
            (patternPlayerPlayable: PatternPlayerPlayable) => {
              const left = patternPlayerPlayable.time * Constants.STEP_WIDTH;
              const width =
                patternPlayerPlayable.duration * Constants.STEP_WIDTH;

              return (
                <span
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    position: "absolute",
                    top: 0,
                    height: 40,
                    left,
                    width,
                    border: "1px solid black",
                  }}
                >
                  {patternPlayerPlayable.note}
                </span>
              );
            }
          )}
        </div>
      )}
    </div>
  );
};

export default PatternChannel;
