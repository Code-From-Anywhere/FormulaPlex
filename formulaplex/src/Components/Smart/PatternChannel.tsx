import React from "react";
import { IoMdAdd } from "react-icons/io";
import { useSelector } from "react-redux";
import { selectProject } from "../../Context/Selectors";
import useUpdatePatternChannel from "../../Hooks/useUpdatePatternChannel";
import {
  Channel,
  Instrument,
  PatternPlayerPlayable,
  TimedMelody,
} from "../../Types/Types";
import { Constants, generatePatternPlayerPlayable } from "../../Util/Util";
import OnOffButton from "../Dumb/OnOffButton";
import ScrollableNumberTextInput from "../Dumb/ScrollableNumberTextInput";
import ScrollableWheelInput from "../Dumb/ScrollableWheelInput";

const PatternChannel = ({
  instrument,
  timedMelody,
  pitch,
  channel,
  onClick,
  channelIndex,
}: {
  instrument?: Instrument;
  timedMelody?: TimedMelody;
  pitch: number;
  channel?: Channel;
  onClick?: () => void;
  patternId?: string;
  channelIndex?: number;
}) => {
  const project = useSelector(selectProject);
  const updatePatternChannel = useUpdatePatternChannel();

  if (!project) {
    return null;
  }

  const steps = new Array(project.beatsPerBar * project.stepsPerBeat)
    .fill(0)
    .map((x, index) => index);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ minWidth: 100 }}>
        {channel && channelIndex !== undefined ? (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <OnOffButton
              value={channel.isOn}
              onChange={(value) =>
                updatePatternChannel(channelIndex, "isOn", value)
              }
            />
            <ScrollableWheelInput
              value={channel.basePitch}
              onChange={(value) =>
                updatePatternChannel(channelIndex, "basePitch", value)
              }
              minValue={Constants.MINIMAL_PITCH}
              maxValue={Constants.MAXIMUM_PITCH}
            />
            <ScrollableWheelInput
              value={channel.velocity}
              onChange={(value) =>
                updatePatternChannel(channelIndex, "velocity", value)
              }
            />

            <ScrollableNumberTextInput
              value={channel.outputMixerTrack}
              onChange={(value) =>
                updatePatternChannel(channelIndex, "outputMixerTrack", value)
              }
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
