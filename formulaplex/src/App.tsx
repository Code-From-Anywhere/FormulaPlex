/*
 *
 * Doel van dit project
 *
 * 1) een synthesyzer maken
 * 2) muziek theorie leren
 * 3) muziek zo minimaal mogelijk omschrijven
 * 4) piano leren spelen
 * 5) muziek visueel maken dmv kleuren, waves, etc.
 * 6) Wat zijn 'formules' die muziek automatisch 'mooi' maken?
 * 7) Welke emoties kun je met muziek naar boven brengen?
 * 8) kun je heel veel goede muziek genereren in korte tijd?
 * 9) Kun je autotuned teksten automatisch genereren voor learning purposes of andere person-immersive doeleinden?
 * 10) what about een site waar je coole music componenten kan delen en hergebruiken? dit kan de basis zijn voor een machine learning algorithme dat leert componeren.
 * 11) [Algorythmic Composition is mij op het hart geschreven](https://en.wikipedia.org/wiki/Algorithmic_composition#:~:text=Algorithmic%20composition%20is%20the%20technique,be%20reduced%20to%20algorithmic%20determinacy)
 *
 * Wat kan ik maken:
 *
 * - Een piano die met toetsen te besturen is, maar ook door er op te drukken, alle pitches beschikbaar maken
 * - Een visualizer die de ambiance mooi weergeeft
 * - Melody[]: een melody creator: noten achter elkaar
 * - TimedMelody[] een formule die bepaalt hoe snel de noten worden afgespeeld. Dit is een schil om de Melody heen.
 * - Paint[]: paints: de melodie die je maakt op verschillende manieren kunnen 'verven': tijd per noot veranderen, pitch veranderen, tijd tussen noten, envelope
 * - Paints en melodies, en melodytimeformulas zijn de primitives. PaintedMelody[] ofwel Fragments[] kan je maken ermee.
 * - Formula: Een script die paints en melodies samen laat komen in de tijd met vloeiende overgangen die automagisch berekend worden.
 * - Formats: Standaard formaten/formules waar je simpelweg een melody in kan gieten om een sicke song te krijgen.
 *
 *
 * Learnings
 * - pas op dat ik niet in elke render een nieuwe Tone.* creeer, want deze mag ik maar gelimiteerd aanmaken anders krijg je sound issues.
 *
 * Relations:
 * - Melody has many TimedMelody
 * - Melody has many Paint
 * - Paint has many TimedMelody
 * - Paint has many Melody
 *
 * Todo tomorrow:
 * - https://www.adajcc.com/blog/2018/10/29/midterm-live-audio-visual-techno-generator
 * - https://www.youtube.com/watch?v=GOWj4IVpcag&ab_channel=TheAudioProgrammer
 * - add dit https://gist.github.com/wchargin/96f2550531b67c379b3e
 * - lees dit https://en.wikipedia.org/wiki/Musical_note#Note_designation_in_accordance_with_octave_name
 * - Add Do re mi as strings instead of abc and also Hz frequency
 * - Add ^, *, and . and .. range so you can play more songs, convert this to actually use another pitch but don't put the pitch in the Melody still.
 * - CRUD melodies, give them names
 * - Add possibility to create a paint from an initialized sound
 * - CRUD paints, give them colors and names
 * - Visualize paint envelope in graph
 * - Maak het mogelijk paints te switchen terwijl je naar een melody luistert
 * - Voeg tijdsmaat toe aan melody: TimedMelody. CRUD, playback
 * - Voeg Fragment toe van TimedMelody[]*Paint[]*Props. CRUD, playback
 * - Voeg Formule toe van Fragment[]*Props. CRUD, playback
 * - Would be cool to support import of notesheets and lossless audio formats
 * - Would be cool to export to youtube/mp3
 * - Exporteerbaar/importeerbaar maken van alle gegevens zodat je verder kan op andere pc
 * - Autotune zou echt killer zijn zodat je hele teksten door een automatische stem kan laten zingen.
 * - use something like [abcjs](https://github.com/paulrosen/abcjs) or similar to render the sheets so you also learn sheets while doing this.
 * - Zet het online op Formulaplex.com met een default store erin met wat sounds zodat je lekker kan experimenteren. Eerste doel: een experimentation browser library voor tonejs. Hiermee kan je zelf de effecten genereren. De app kan dan Tone.js code voor je genereren.
 *
 *
 *
 * THE FUTURE:
 *
 * - Automatically combine primitives together to generate a thousand random songs: generation 0
 * - The top 100 views on youtube survive: They mutate and generate generation 1
 * - Generate music for learning spanish. Just sentences in rap-form or sing form: spanish and english
 * - Generate MasterCrimeZ music that changes based on the situation
 *
 *  */

import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import * as Tone from "tone";
import "./App.css";
//create a synth and connect it to the main output (your speakers)
import { Note } from "./Types";

const baseNotes = ["c", "d", "e", "f", "g", "a", "b"];
type Sound = Tone.DuoSynth | Tone.MembraneSynth | Tone.NoiseSynth;

type Melody = string[];

interface SoundLoop {
  type: string;
  sound?: Sound;
  attackNote: Note;
  attackTime: string;
  releaseTime: string;
  attackVelocity: number;
  bpm: number;

  start: number;
  end: number;
}
const sampler = new Tone.DuoSynth().toDestination();

type AnyToneSynth =
  | Tone.Synth
  | Tone.DuoSynth
  | Tone.MembraneSynth
  | Tone.NoiseSynth;

const MINIMAL_PITCH = -4;
const MAXIMUM_PITCH = 11;

const Piano = ({
  sample,
  isRecordingMelody,
  setCurrentMelody,
  currentMelody,
  currentKey,
  setCurrentKey,
}: {
  sample: AnyToneSynth;
  isRecordingMelody: boolean;
  setCurrentMelody: (melody: Melody) => void;
  currentMelody: Melody;
  currentKey: string | null;
  setCurrentKey: (key: string | null) => void;
}) => {
  const [pitch, setPitch] = useState(1);

  useHotkeys("=", () =>
    setPitch((pitch) => (pitch >= MAXIMUM_PITCH ? MAXIMUM_PITCH : pitch + 1))
  );
  useHotkeys("-", () =>
    setPitch((pitch) => (pitch <= MINIMAL_PITCH ? MINIMAL_PITCH : pitch - 1))
  );

  useEffect(() => {
    window.addEventListener("keydown", (event) => {
      // const shift = event.shiftKey;
      // const ctrl = event.ctrlKey;
      // const alt = event.altKey;
      // const cmd = event.metaKey;

      if (baseNotes.includes(event.key.toLowerCase())) {
        if (currentKey !== event.key) {
          setCurrentKey(event.key);
        }
      }
    });

    window.addEventListener("keyup", (event) => {
      setCurrentKey(null);
    });
  }, []);

  useEffect(() => {
    if (currentKey) {
      //  sampler.triggerRelease(); probably not needed

      if (isRecordingMelody) {
        setCurrentMelody([...currentMelody, currentKey]);
      }
      sample.triggerAttack(`${currentKey}${pitch}`, Tone.context.currentTime);
    } else {
      console.log("trigger release");
      sample.triggerRelease();
    }
  }, [currentKey, pitch]);

  return (
    <div>
      <div
        style={{ position: "relative", display: "flex", flexDirection: "row" }}
      >
        {baseNotes
          .map((n) => `${n}#`)
          .map((midNote, index) => {
            if (index === baseNotes.length - 1 || midNote === "e#") return null; //don't exist
            return (
              <div
                key={`midNote${index}`}
                onMouseDown={() => setCurrentKey(midNote)}
                onMouseUp={() => setCurrentKey(null)}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 35 + index * 50,
                  width: 30,
                  height: 100,
                  backgroundColor: currentKey === midNote ? "#404040" : "black",
                }}
              >
                <p style={{ color: "white", fontWeight: "bold" }}>{midNote}</p>
              </div>
            );
          })}
        {baseNotes.map((note) => {
          const extraNote =
            note === "f"
              ? "(e#)"
              : note === "c"
              ? "(b#)"
              : note === "b"
              ? "(Cb)"
              : null;
          return (
            <div
              onMouseDown={() => setCurrentKey(note)}
              onMouseUp={() => setCurrentKey(null)}
              style={{
                backgroundColor: currentKey === note ? "#CCC" : "white",
                borderWidth: "1px",
                borderColor: "black",
                borderStyle: "solid",
                boxSizing: "border-box",
                width: 50,
                height: 200,
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p style={{ color: "black", fontWeight: "bold" }}>{note}</p>

              <div>
                <p style={{ color: "black", fontWeight: "bold" }}>
                  {extraNote}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <p style={{ fontSize: 24 }}>
          {currentKey}
          {pitch}
        </p>
      </div>
    </div>
  );
};

function usePersistedState<T>(key: string, defaultValue: any): [T, any] {
  const [state, setState] = useState<T>(() =>
    localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key) || "")
      : defaultValue
  );
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function App() {
  const [loops, setLoops] = usePersistedState<SoundLoop[]>("loops", []);
  const [melodies, setMelodies] = usePersistedState<Melody[]>("melodies", []);
  const [currentMelody, setCurrentMelody] = useState<Melody>([]);
  const [isRecordingMelody, setIsRecordingMelody] = useState(false);
  const [currentKey, setCurrentKey] = useState<string | null>(null);

  const [stop, setStop] = useState<() => any>(() => null);

  const newSoundLoop = (
    soundString: "DuoSynth" | "MembraneSynth" | "NoiseSynth"
  ) => {
    const newSound: SoundLoop = {
      type: soundString,
      attackNote: "A1",
      attackTime: "+0",
      releaseTime: "+0.2",
      attackVelocity: 1,
      bpm: 120,
      start: 0,
      end: 999,
    };

    setLoops([...loops, newSound]);
  };

  const reset = () => {
    setLoops([]);
  };

  const playLoop = (loop: SoundLoop) => {
    //@ts-ignore
    const sound: Sound = new Tone[loop.type]({
      pitchDecay: 0.05,
      octaves: 4,
      oscillator: {
        type: "fmcustom",
        phase: 140,
        modulationType: "sine",
        modulationIndex: 0.8,
        partials: [1], //1,0.1,0.01,0.01
      },
      envelope: {
        attack: 0.01,
        decay: 0.3,
        sustain: 0.71,
        release: 0.05,
        attackCurve: "exponential",
      },
    }).toDestination();

    console.log("sound", typeof sound);
    const clock = new Tone.Clock((time) => {
      sound?.triggerAttack(
        loop.attackNote,
        //@ts-ignore
        loop.attackTime,
        loop.attackVelocity
      );

      sound?.triggerRelease(loop.releaseTime);
    }, loop.bpm / 60);

    clock.start();
    setStop(() => () => clock.stop(0));
  };
  const colors = ["red", "blue", "lime", "yellow", "brown"];
  const makeColor = (index: number) => colors[index % colors.length];

  const blackOrWhiteText = (color: string) =>
    color === "blue" ? "white" : "black";
  // This is "slow", relative to WebAudio, it's not playing the pitch in a timely fashion...
  return (
    <div className="App">
      <h1>FormulaPlex</h1>

      <p>Melodies:</p>
      {melodies.map((melody, index) => {
        return (
          <div
            onClick={async () => {
              for (const note of melody) {
                setCurrentKey(note);
                await timeout(250);
                setCurrentKey(null);
                await timeout(250);
              }
            }}
          >
            <p>
              Melody {index}:{melody.map((note) => `${note},`)}
            </p>
          </div>
        );
      })}

      <p>Sounds:</p>
      {loops.map((loop, index) => {
        const color = makeColor(index);
        return (
          <div key={`loop${index}`} style={{ backgroundColor: color }}>
            {(Object.keys(loop) as string[]).map((property) => {
              //@ts-ignore
              const value = loop[property];
              return (
                <p
                  key={`loop${index}property${property}`}
                  style={{ color: blackOrWhiteText(color) }}
                >
                  {property}: {value}
                </p>
              );
            })}

            <button onClick={() => playLoop(loop)}>Play</button>
            <button onClick={() => stop()}>Stop</button>
          </div>
        );
      })}
      <button onClick={() => newSoundLoop("DuoSynth")}>New DuoSynth</button>
      <button onClick={() => newSoundLoop("MembraneSynth")}>
        New MembraneSynth
      </button>
      <button onClick={() => newSoundLoop("NoiseSynth")}>New NoiseSynth</button>
      <button onClick={() => reset()}>Reset</button>

      <button
        onClick={() => {
          setCurrentMelody([]);
          setIsRecordingMelody(!isRecordingMelody);
        }}
      >
        {isRecordingMelody ? "Stop recording" : "Start recording"}
      </button>
      {isRecordingMelody && currentMelody.length > 0 && (
        <button
          onClick={() => {
            setMelodies([...melodies, currentMelody]);
            setCurrentMelody([]);
            setIsRecordingMelody(false);
          }}
        >
          Save Melody
        </button>
      )}

      <p>{currentMelody.map((note) => `${note},`)}</p>

      <Piano
        sample={sampler}
        currentMelody={currentMelody}
        isRecordingMelody={isRecordingMelody}
        setCurrentMelody={setCurrentMelody}
        currentKey={currentKey}
        setCurrentKey={setCurrentKey}
      />
    </div>
  );
}
export default App;
