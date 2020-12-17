import * as Tone from "tone";
import {
  Channel,
  Instrument,
  PatternPlayer,
  PatternPlayerPlayable,
  Step,
  SynthTypes,
  TimedMelody,
} from "./Types";

export const newProject = (name: string) => ({
  id: generateId(),
  beatsPerBar: 4,
  bpm: 120,
  color: generateColor(),
  name,
  pitch: 4,
  stepsPerBeat: 4,
});

export const Constants = {
  ICON_SIZE: 12,
  MINIMAL_PITCH: -4,
  MAXIMUM_PITCH: 11,
  DEFAULT_PATTERN_LENGTH: 16,
  DEFAULT_PATTERN_QUANTIZATION: 1 / 4,
  NUM_MIXER_TRACKS: 10,
  STEP_WIDTH: 40,
};

export const makeIntOrZero = (value: string): number =>
  !isNaN(parseInt(value)) ? parseInt(value) : 0;
export const generateId = () =>
  "id" + Math.round(Math.random() * 9999999999999);

export const selectRandomEntry = <T>(array: T[]): T =>
  array[Math.floor(array.length * Math.random())];

export const generateColor = () =>
  selectRandomEntry([
    "black",
    "red",
    "green",
    "yellow",
    "blue",
    "orange",
    "purple",
    "lightblue",
    "lime",
  ]);

export const generateSynth = (soundString: SynthTypes, properties: any) => {
  //@ts-ignore
  const Synth = new Tone[soundString](properties);
  return Synth.toDestination();
};
export const generatePatternPlayerArray = (
  channels: Channel[],
  instruments: Instrument[],
  timedMelodies: TimedMelody[]
) =>
  channels
    .map((channel) => {
      const instrument = instruments.find((p) => p.id === channel.instrumentId);
      const timedMelody = timedMelodies.find(
        (t) => t.id === channel.timedMelodyId
      );

      if (instrument && timedMelody) {
        return {
          sample: generateSynth(instrument.type, instrument.properties),
          type: instrument.type,
          timedMelody,
        };
      } else {
        return null;
      }
    })
    .filter((x) => !!x);

export const stepToSeconds = (step: Step) => step * 0.05;
export const startPlayPattern = (
  patternPlayerArray: PatternPlayer[],
  pitch: number,
  velocity: number,
  isLoop: boolean
) => {
  for (const patternPlayerOrNull of patternPlayerArray) {
    if (!patternPlayerOrNull) continue;
    const { sample, timedMelody } = patternPlayerOrNull;

    const whatToPlay = generatePatternPlayerPlayable(
      timedMelody,
      pitch,
      velocity
    );

    const part = new Tone.Part((time, value) => {
      // the value is an object which contains both the note and the velocity
      sample.triggerAttackRelease(
        value.note,
        stepToSeconds(value.duration),
        time,
        value.velocity
      );
    }, whatToPlay).start(0);

    const lastItem = whatToPlay[whatToPlay.length - 1];

    const endTime =
      stepToSeconds(lastItem.time) + stepToSeconds(lastItem.duration);

    if (isLoop) {
      part.loop = true;
      part.loopStart = 0;
      part.loopEnd = endTime;
    } else {
      Tone.Transport.scheduleOnce(() => {
        console.log("dispose of item");
        sample.dispose();
      }, endTime);
    }

    Tone.Transport.start();
  }
};
export const generatePatternPlayerPlayable = (
  timedMelody: TimedMelody,
  pitch: number,
  velocity: number = 1
): PatternPlayerPlayable[] =>
  timedMelody.timedMelody.map((key, index, array) => {
    const modifiedPitch = modifyPitch(pitch, key.modifier);

    const startTime = key.startPosition;

    const note = `${key.note}${modifiedPitch}`;
    const duration =
      key.duration !== undefined ? key.duration : timedMelody.defaultDuration;

    return {
      note,
      time: startTime,
      velocity,
      duration,
    };
  });
export const modifyPitch = (pitch: number, modifier?: string) =>
  modifier === "."
    ? pitch - 1
    : modifier === ".."
    ? pitch - 2
    : modifier === "^"
    ? pitch + 1
    : modifier === "*"
    ? pitch + 2
    : pitch;

export function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
