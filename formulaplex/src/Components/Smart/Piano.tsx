import { useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import * as Tone from "tone";
//create a synth and connect it to the main output (your speakers)
import { Key, Melody, Note, Sample } from "../Types";
import { Constants, generateColor, modifyPitch } from "../Util";

const baseNotes = ["c", "d", "e", "f", "g", "a", "b"];
const modifiers = ["..", ".", "", "^", "*"];

const generateId = () => "id" + Math.round(Math.random() * 9999999999999);

const generateNewMelody = (firstKey: Key): Melody => ({
  name: null,
  id: generateId(),
  color: generateColor(),
  melody: [{ note: firstKey.note, modifier: firstKey.modifier }],
});

const Piano = ({
  sample,
  isRecordingMelody,
  setCurrentMelody,
  currentMelody,
  currentKey,
  setCurrentKey,
  pitch,
  setPitch,
}: {
  sample: Sample;
  isRecordingMelody: boolean;
  setCurrentMelody: (melody: Melody) => void;
  currentMelody: Melody | null;
  currentKey: Key | null;
  setCurrentKey: (key: Key | null) => void;
  pitch: number;
  setPitch: React.Dispatch<React.SetStateAction<number>>;
}) => {
  useHotkeys("=", () =>
    setPitch((pitch: number) =>
      pitch >= Constants.MAXIMUM_PITCH ? Constants.MAXIMUM_PITCH : pitch + 1
    )
  );
  useHotkeys("-", () =>
    setPitch((pitch) =>
      pitch <= Constants.MINIMAL_PITCH ? Constants.MINIMAL_PITCH : pitch - 1
    )
  );

  useEffect(() => {
    window.addEventListener("keydown", (event) => {
      // const shift = event.shiftKey;
      // const ctrl = event.ctrlKey;
      // const alt = event.altKey;
      // const cmd = event.metaKey;

      if (baseNotes.includes(event.key.toLowerCase())) {
        if (currentKey?.note !== event.key) {
          setCurrentKey({ note: event.key, modifier: "" });
        }
      }
    });

    window.addEventListener("keyup", (event) => {
      setCurrentKey(null);
    });
  }, []);

  useEffect(() => {
    if (currentKey) {
      if (isRecordingMelody) {
        setCurrentMelody(
          currentMelody
            ? {
                ...currentMelody,
                melody: [...currentMelody.melody, currentKey],
              }
            : generateNewMelody(currentKey)
        );
      }

      const modifiedPitch = modifyPitch(pitch, currentKey.modifier);

      const convertedKeyPitchCombination: Note = `${currentKey.note}${modifiedPitch}` as Note;

      sample.sample.triggerAttack(
        convertedKeyPitchCombination,
        Tone.context.currentTime
      );
    } else {
      sample.sample.triggerRelease();
    }
  }, [
    currentKey,
    // pitch,
    // sample,
    // currentMelody,
    // isRecordingMelody,
    // setCurrentMelody,
  ]);

  const pianoContainer = useRef<HTMLDivElement | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div
        style={{
          overflowX: "scroll",
          whiteSpace: "nowrap",
          height: "20vh",
        }}
        ref={pianoContainer}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            height: "100%",
            width: 50 * modifiers.length * baseNotes.length,
          }}
        >
          {modifiers.map((modifier, modifierIndex) =>
            baseNotes
              .map((note) => ({ note: `${note}#`, modifier }))
              .map((note, index) => {
                const midNote = note.note;

                if (index === baseNotes.length - 1 || midNote === "e#")
                  return null; //don't exist
                return (
                  <div
                    key={`midKey${note.note}${note.modifier}`}
                    onMouseDown={() =>
                      setCurrentKey({ note: midNote, modifier: note.modifier })
                    }
                    onMouseUp={() => setCurrentKey(null)}
                    style={{
                      position: "absolute",
                      top: 0,
                      left:
                        35 + 50 * index + 50 * modifierIndex * baseNotes.length,
                      width: 30,
                      height: 100,
                      backgroundColor:
                        currentKey?.note === midNote &&
                        currentKey.modifier === note.modifier
                          ? "#404040"
                          : "black",
                    }}
                  >
                    <p style={{ color: "white", fontWeight: "bold" }}>
                      {midNote}
                      {note.modifier}
                    </p>
                  </div>
                );
              })
          )}
          {modifiers.map((modifier) =>
            baseNotes
              .map((note) => ({ note, modifier }))
              .map(({ note, modifier }) => {
                const extraNote =
                  note === "f"
                    ? "e#"
                    : note === "c"
                    ? "b#"
                    : note === "b"
                    ? "Cb"
                    : null;
                const extraNoteModified = extraNote
                  ? `(${extraNote}${modifier})`
                  : null;
                return (
                  <div
                    key={`key${note}${modifier}`}
                    onMouseDown={() => setCurrentKey({ note, modifier })}
                    onMouseUp={() => setCurrentKey(null)}
                    style={{
                      backgroundColor:
                        currentKey?.note === note &&
                        currentKey?.modifier === modifier
                          ? "#CCC"
                          : "white",
                      borderWidth: "1px",
                      borderColor: "black",
                      borderStyle: "solid",
                      boxSizing: "border-box",
                      width: "50px",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <p style={{ color: "black", fontWeight: "bold" }}>
                      {note}
                      {modifier}
                    </p>

                    {extraNoteModified && (
                      <div>
                        <p style={{ color: "black", fontWeight: "bold" }}>
                          {extraNoteModified}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
          )}
        </div>
      </div>
      <div style={{ width: 300, backgroundColor: "#DDD" }}>
        <p style={{ fontSize: 24 }}>
          {currentKey?.note}
          {modifyPitch(pitch, currentKey?.modifier)}
        </p>
      </div>
    </div>
  );
};

export default Piano;
