import { useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useDispatch, useSelector } from "react-redux";
import * as Tone from "tone";
import {
  actionSetCurrentKeys,
  actionSetProject,
  actionSetRecordingMelody,
} from "../../Context/Actions";
import {
  selectCurrentKeys,
  selectCurrentSynth,
  selectIsRecordingMelody,
  selectProjectPitch,
  selectRecordingMelody,
} from "../../Context/Selectors";
//create a synth and connect it to the main output (your speakers)
import { Key, Melody, Note } from "../../Types/Types";
import { Constants, generateColor, modifyPitch } from "../../Util/Util";
const baseNotes = ["c", "d", "e", "f", "g", "a", "b"];
const modifiers = ["..", ".", "", "^", "*"];

const generateId = () => "id" + Math.round(Math.random() * 9999999999999);

const generateNewMelody = (firstKey: Key): Melody => ({
  name: null,
  id: generateId(),
  color: generateColor(),
  melody: [{ note: firstKey.note, modifier: firstKey.modifier }],
});

const Piano = () => {
  const dispatch = useDispatch();
  const currentSynth = useSelector(selectCurrentSynth);
  const isRecordingMelody = useSelector(selectIsRecordingMelody);
  const recordingMelody = useSelector(selectRecordingMelody);
  const currentKeys = useSelector(selectCurrentKeys);
  const projectPitch = useSelector(selectProjectPitch);
  const setRecordingMelody = (melody: Melody) =>
    dispatch(actionSetRecordingMelody(melody));

  const setCurrentKeys = (currentKeys: Key[]) =>
    dispatch(actionSetCurrentKeys(currentKeys));
  const setPitch = (pitch: number) =>
    dispatch(actionSetProject("pitch", pitch));

  useHotkeys("=", () => {
    setPitch(
      projectPitch && projectPitch >= Constants.MAXIMUM_PITCH
        ? Constants.MAXIMUM_PITCH
        : projectPitch
        ? projectPitch + 1
        : Constants.DEFAULT_PITCH
    );
  });
  useHotkeys("-", () => {
    setPitch(
      projectPitch && projectPitch <= Constants.MINIMAL_PITCH
        ? Constants.MINIMAL_PITCH
        : projectPitch
        ? projectPitch - 1
        : Constants.DEFAULT_PITCH
    );
  });

  useEffect(() => {
    window.addEventListener("keydown", (event) => {
      // const shift = event.shiftKey;
      // const ctrl = event.ctrlKey;
      // const alt = event.altKey;
      // const cmd = event.metaKey;

      if (baseNotes.includes(event.key.toLowerCase())) {
        if (!currentKeys.find((x) => x.note === event.key)) {
          setCurrentKeys([...currentKeys, { note: event.key, modifier: "" }]);
        }
      }
    });

    window.addEventListener("keyup", (event) => {
      setCurrentKeys(currentKeys.filter((x) => x.note !== event.key));
    });
  }, []);

  useEffect(() => {
    if (currentKeys.length > 0 && projectPitch) {
      if (isRecordingMelody) {
        setRecordingMelody(
          recordingMelody
            ? {
                ...recordingMelody,
                melody: [...recordingMelody.melody, currentKeys[0]],
              }
            : generateNewMelody(currentKeys[0])
        );
      }

      const modifiedPitch = modifyPitch(projectPitch, currentKeys[0].modifier);

      const convertedKeyPitchCombination: Note = `${currentKeys[0].note}${modifiedPitch}` as Note;

      currentSynth.sample.triggerAttack(
        convertedKeyPitchCombination,
        Tone.context.currentTime
      );
    } else {
      currentSynth.sample.triggerRelease();
    }
  }, [
    currentKeys,
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
                      setCurrentKeys([
                        ...currentKeys,
                        { note: midNote, modifier: note.modifier },
                      ])
                    }
                    onMouseUp={() =>
                      setCurrentKeys(
                        currentKeys.filter(
                          (x) =>
                            x.note === midNote && x.modifier === note.modifier
                        )
                      )
                    }
                    style={{
                      position: "absolute",
                      top: 0,
                      left:
                        35 + 50 * index + 50 * modifierIndex * baseNotes.length,
                      width: 30,
                      height: 100,
                      backgroundColor: currentKeys.find(
                        (x) =>
                          x.note === midNote && x.modifier === note.modifier
                      )
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

                const isKeySelected = !!currentKeys.find(
                  (x) => x.modifier === modifier && x.note === note
                );

                return (
                  <div
                    key={`key${note}${modifier}`}
                    onMouseDown={() =>
                      setCurrentKeys([...currentKeys, { note, modifier }])
                    }
                    onMouseUp={() =>
                      setCurrentKeys(
                        currentKeys.filter(
                          (x) => x.note !== note && x.modifier !== modifier
                        )
                      )
                    }
                    style={{
                      backgroundColor: isKeySelected ? "#CCC" : "white",
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
          {currentKeys.map((key) => {
            return `${key?.note} ${modifyPitch(
              projectPitch || Constants.DEFAULT_PITCH,
              key?.modifier
            )}`;
          })}
        </p>
      </div>
    </div>
  );
};

export default Piano;
