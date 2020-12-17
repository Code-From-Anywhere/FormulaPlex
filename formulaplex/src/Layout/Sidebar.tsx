import { AiFillDelete } from "react-icons/ai";
import { BiPlay } from "react-icons/bi";
import { BsStopFill } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import * as Tone from "tone";
import ColorBadge from "../Components/ColorBadge";
import Style from "../Style";
import { Melody, PatternPlayer, SynthTypes, synthTypes } from "../Types";
import {
  Constants,
  generatePatternPlayerArray,
  generateSynth,
  startPlayPattern,
  timeout,
} from "../Util";

const Sidebar = () => {
  const selectInstrumentRef = useRef<HTMLSelectElement | null>(null);

  const newInstrument = (soundString: SynthTypes) => {
    const defaults = defaultSynthOptions[soundString];
    const synth = generateSynth(soundString, defaults);

    currentSynth.sample.dispose();
    setCurrentSynth({ sample: synth, type: soundString });

    const newInstrument: Instrument = {
      id: generateId(),
      type: soundString,
      name: null,
      color: generateColor(),
      properties: defaults,
    };

    setInstruments([...instruments, newInstrument]);
  };

  const addTimedMelody = (melody: Melody) => {
    const newTimedMelody: TimedMelody = {
      defaultDuration: 1,
      pitch: 4,
      id: generateId(),
      color: generateColor(),
      melodyId: melody.id,
      name: null,
      timedMelody: melody.melody.map((key, index) => ({
        ...key,
        startPosition: index,
      })),
    };

    setTimedMelodies([...timedMelodies, newTimedMelody]);
  };

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const renderMelodies = (
    <div>
      <p style={{ fontWeight: "bold" }}>Melodies:</p>

      <button
        onClick={() => {
          setCurrentMelody(null);
          setIsRecordingMelody(!isRecordingMelody);
        }}
      >
        {isRecordingMelody ? "Stop recording" : "Start recording"}
      </button>
      {isRecordingMelody && (currentMelody?.melody.length || 0) > 0 && (
        <button
          onClick={() => {
            setMelodies([...melodies, currentMelody as Melody]);
            setCurrentMelody(null);
            setIsRecordingMelody(false);
          }}
        >
          Save Melody
        </button>
      )}
      {melodies.map((melody, index) => {
        const filteredTimedMelodies = timedMelodies.filter(
          (t) => t.melodyId === melody.id
        );

        const isSelected = selectedMelody?.id === melody.id;
        return (
          <div>
            <div
              onClick={() => {
                setSelectedMelody(isSelected ? null : melody);
              }}
              style={{
                border: isSelected ? "1px dotted black" : undefined,
                borderRadius: 3,
                padding: 3,
              }}
            >
              {melody.name || `Melody ${index}`}
              <BiPlay
                size={Constants.ICON_SIZE}
                onClick={async () => {
                  for (const { note, modifier } of melody.melody) {
                    setCurrentKey({ note, modifier });
                    await timeout(250);
                    setCurrentKey(null);
                    await timeout(250);
                  }
                }}
              />
              <AiFillDelete
                size={Constants.ICON_SIZE}
                onClick={() => {
                  setMelodies(melodies.filter((melody, i) => i !== index));
                }}
              />

              <IoMdAdd
                size={Constants.ICON_SIZE}
                onClick={() => {
                  addTimedMelody(melody);
                }}
              />
            </div>
            {filteredTimedMelodies && (
              <div>
                {filteredTimedMelodies.map((timedMelody, index) => {
                  const isSelected = timedMelody.id === selectedTimedMelody?.id;
                  return (
                    <div
                      key={`${timedMelody.id}timedMelody`}
                      onClick={() =>
                        selectedTimedMelody?.id === timedMelody.id
                          ? setSelectedTimedMelody(null)
                          : setSelectedTimedMelody(timedMelody)
                      }
                      style={{
                        border: isSelected ? "1px dotted black" : undefined,
                        borderRadius: 3,
                        padding: 3,
                        marginLeft: 20,
                      }}
                    >
                      {timedMelody.name || `Timed melody ${index}`}

                      <BiPlay
                        size={Constants.ICON_SIZE}
                        onClick={async () => {
                          for (const {
                            note,
                            modifier,
                            duration,
                            startPosition,
                          } of timedMelody.timedMelody) {
                            // Make Tone.Transport that plays the melody in a loop
                            // setCurrentKey({ note, modifier });
                            // await timeout(
                            //   duration !== undefined
                            //     ? duration
                            //     : timedMelody.defaultDuration
                            // );
                            // setCurrentKey(null);
                            // await timeout(
                            //   pauseEnd !== undefined
                            //     ? pauseEnd
                            //     : timedMelody.defaultPause
                            // );
                          }
                        }}
                      />
                      <AiFillDelete
                        size={Constants.ICON_SIZE}
                        onClick={() => {
                          setSelectedTimedMelody(null);
                          setTimedMelodies(
                            timedMelodies.filter((t, i) => i !== index)
                          );
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
  const renderRythms = (
    <div>
      <p style={{ fontWeight: "bold" }}>Rythms:</p>
      <p>
        Coming soon. Rythms are songs to automatically generate TimedMelodies
      </p>
    </div>
  );

  const renderPatterns = (
    <div>
      <p style={{ fontWeight: "bold" }}>Patterns:</p>
      {patterns.map((pattern) => {
        const isSelected = pattern.id === selectedPatternId;
        const ourPatternPlayer = !!patternPlayers[pattern.id];
        return (
          <div
            onClick={() => setSelectedPatternId(pattern.id)}
            key={`pattern${pattern.id}`}
            style={Style.itemStyle(isSelected)}
          >
            {pattern.name}{" "}
            {ourPatternPlayer ? (
              <BsStopFill
                key={`stopIcon${pattern.id}${ourPatternPlayer}`}
                size={Constants.ICON_SIZE}
                onClick={() => {
                  // always first stop before diposing.
                  Tone.Transport.stop(0);
                  patternPlayers[pattern.id]?.map((patternPlayer) => {
                    patternPlayer.sample.dispose();
                  });

                  const newPatternPlayers = { ...patternPlayers }; //NB: Make sure dat dit geen memory leak veroorzaakt
                  delete newPatternPlayers[pattern.id];

                  console.log("newPatternPlayers", newPatternPlayers);
                  setPatternPlayers(newPatternPlayers);
                }}
              />
            ) : (
              <BiPlay
                key={`playIcon${pattern.id}${ourPatternPlayer}`}
                size={Constants.ICON_SIZE}
                onClick={() => {
                  const patternPlayerArray = generatePatternPlayerArray(
                    pattern.channels,
                    instruments,
                    timedMelodies
                  );
                  const array = patternPlayerArray as PatternPlayer[];
                  setPatternPlayers({ ...patternPlayers, [pattern.id]: array });
                  startPlayPattern(array, pitch, 1, true);
                }}
              />
            )}
            <AiFillDelete
              size={Constants.ICON_SIZE}
              onClick={() => {
                setPatterns(patterns.filter((f) => f.id !== pattern.id));
              }}
            />
          </div>
        );
      })}
    </div>
  );

  const renderSongs = (
    <div>
      <p style={{ fontWeight: "bold" }}>Songs:</p>
      <p>Coming soon. Formulas are a combination of patterns on a timeline.</p>
    </div>
  );

  const renderCompositions = (
    <div>
      <p style={{ fontWeight: "bold" }}>Compositions:</p>
      <p>
        Coming soon. Compositions are the grammar of a song, the underlying
        structure. Compositions can be used to automatically generate songs.
      </p>
    </div>
  );

  const renderInstruments = (
    <div>
      <p style={{ fontWeight: "bold" }}>Instruments:</p>

      <select
        ref={selectInstrumentRef}
        onChange={(e) => {
          if (e.target.value !== "new") {
            newInstrument(e.target.value as SynthTypes);
            if (selectInstrumentRef.current) {
              selectInstrumentRef.current.value = "new";
            }
          }
        }}
      >
        <option value="new">New</option>
        {synthTypes.map((type) => (
          <option key={`selectSynth${type}`} value={type}>
            {type}
          </option>
        ))}
      </select>
      {instruments.map((instrument, index) => {
        const isSelected = selectedInstrumentId === instrument.id;
        return (
          <div
            key={`instrument${index}`}
            onClick={() => {
              setSelectedInstrumentId(instrument.id);
              currentSynth.sample.dispose();

              setCurrentSynth({
                sample: generateSynth(instrument.type, instrument.properties),
                type: instrument.type,
              });
            }}
            style={Style.itemStyle(isSelected)}
          >
            <ColorBadge color={instrument.color} />

            {instrument.name || `Instrument ${index}`}
            <AiFillDelete
              size={Constants.ICON_SIZE}
              onClick={() => {
                setInstruments(
                  instruments.filter((p) => p.id !== instrument.id)
                );
              }}
            />
          </div>
        );
      })}
    </div>
  );
  return (
    <div>
      {renderMelodies}
      {renderRythms}
      {renderCompositions}
      {renderInstruments}
      {renderPatterns}
      {renderSongs}
    </div>
  );
};

export default Sidebar;
