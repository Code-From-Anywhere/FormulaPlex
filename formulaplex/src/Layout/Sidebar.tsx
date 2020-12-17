import { useRef } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BiPlay } from "react-icons/bi";
import { BsStopFill } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import * as Tone from "tone";
import ColorBadge from "../Components/Dumb/ColorBadge";
import {
  actionSetCurrentSynth,
  actionSetInstruments,
  actionSetMelodies,
  actionSetPatternPlayers,
  actionSetPatterns,
  actionSetSelectedInstrumentId,
  actionSetSelectedMelodyId,
  actionSetSelectedPatternId,
  actionSetSelectedTimedMelodyId,
  actionSetTimedMelodies,
} from "../Context/Actions";
import {
  selectCurrentSynth,
  selectInstruments,
  selectMelodies,
  selectPatternPlayers,
  selectPatterns,
  selectProjectPitch,
  selectSelectedInstrumentId,
  selectSelectedMelodyId,
  selectSelectedPatternId,
  selectSelectedTimedMelodyId,
  selectTimedMelodies,
} from "../Context/Selectors";
import Style from "../Style/Style";
import {
  defaultSynthOptions,
  Instrument,
  Melody,
  Pattern,
  PatternPlayer,
  PatternPlayersPerPattern,
  Sample,
  SynthTypes,
  synthTypes,
  TimedMelody,
} from "../Types/Types";
import {
  Constants,
  generateColor,
  generateId,
  generatePatternPlayerArray,
  generateSynth,
  startPlayPattern,
} from "../Util/Util";

const Sidebar = () => {
  const selectInstrumentRef = useRef<HTMLSelectElement | null>(null);

  const dispatch = useDispatch();

  const currentSynth = useSelector(selectCurrentSynth);
  const setCurrentSynth = (sample: Sample) =>
    dispatch(actionSetCurrentSynth(sample));
  const setInstruments = (instruments: Instrument[]) =>
    dispatch(actionSetInstruments(instruments));

  const instruments = useSelector(selectInstruments);

  const setTimedMelodies = (timedMelodies: TimedMelody[]) =>
    dispatch(actionSetTimedMelodies(timedMelodies));

  const projectPitch = useSelector(selectProjectPitch);
  const setPatternPlayers = (patternPlayers: PatternPlayersPerPattern) =>
    dispatch(actionSetPatternPlayers(patternPlayers));

  const setPatterns = (patterns: Pattern[]) =>
    dispatch(actionSetPatterns(patterns));

  const setSelectedMelodyId = (id: string | null) =>
    dispatch(actionSetSelectedMelodyId(id));

  const setSelectedTimedMelodyId = (id: string | null) =>
    dispatch(actionSetSelectedTimedMelodyId(id));

  const setSelectedPatternId = (id: string | null) =>
    dispatch(actionSetSelectedPatternId(id));

  const setSelectedInstrumentId = (id: string | null) =>
    dispatch(actionSetSelectedInstrumentId(id));

  const setMelodies = (melodies: Melody[]) =>
    dispatch(actionSetMelodies(melodies));
  const timedMelodies = useSelector(selectTimedMelodies);
  const melodies = useSelector(selectMelodies);
  const patterns = useSelector(selectPatterns);
  const selectedInstrumentId = useSelector(selectSelectedInstrumentId);
  const selectedPatternId = useSelector(selectSelectedPatternId);
  const selectedMelodyId = useSelector(selectSelectedMelodyId);
  const selectedTimedMelodyId = useSelector(selectSelectedTimedMelodyId);
  const patternPlayers = useSelector(selectPatternPlayers);

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

  const renderMelodies = (
    <div>
      <p style={{ fontWeight: "bold" }}>Melodies:</p>

      {melodies.map((melody, index) => {
        const filteredTimedMelodies = timedMelodies.filter(
          (t) => t.melodyId === melody.id
        );

        const isSelected = selectedMelodyId === melody.id;
        return (
          <div>
            <div
              onClick={() => {
                setSelectedMelodyId(isSelected ? null : melody.id);
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
                  // for (const { note, modifier } of melody.melody) {
                  //   setCurrentKey({ note, modifier });
                  //   await timeout(250);
                  //   setCurrentKey(null);
                  //   await timeout(250);
                  // }
                  //do this with Tone.Transport
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
                  const isSelected = timedMelody.id === selectedTimedMelodyId;
                  return (
                    <div
                      key={`${timedMelody.id}timedMelody`}
                      onClick={() =>
                        selectedTimedMelodyId === timedMelody.id
                          ? setSelectedTimedMelodyId(null)
                          : setSelectedTimedMelodyId(timedMelody.id)
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
                          setSelectedTimedMelodyId(null);
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
                  if (projectPitch) {
                    const patternPlayerArray = generatePatternPlayerArray(
                      pattern.channels,
                      instruments,
                      timedMelodies
                    );
                    const array = patternPlayerArray as PatternPlayer[];
                    setPatternPlayers({
                      ...patternPlayers,
                      [pattern.id]: array,
                    });
                    startPlayPattern(array, projectPitch, 1, true);
                  }
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
