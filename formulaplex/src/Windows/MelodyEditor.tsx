import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  actionSetMelodies,
  actionSetSelectedMelodyId,
} from "../Context/Actions";
import { selectMelodies, selectSelectedMelody } from "../Context/Selectors";
import { Melody } from "../Types/Types";

const MelodyEditor = () => {
  const dispatch = useDispatch();
  const selectedMelody = useSelector(selectSelectedMelody);
  const melodies = useSelector(selectMelodies);
  const setSelectedMelodyId = (id: string) =>
    dispatch(actionSetSelectedMelodyId(id));
  const setMelodies = (melodies: Melody[]) =>
    dispatch(actionSetMelodies(melodies));

  return selectedMelody ? (
    <div>
      <input
        type="text"
        value={selectedMelody.name === null ? "Melody" : selectedMelody.name}
        onChange={(e) => {
          const newMelody = { ...selectedMelody, name: e.target.value };
          setSelectedMelodyId(newMelody.id);
          setMelodies(
            melodies.map((x) => (x.id === selectedMelody.id ? newMelody : x))
          );
        }}
        style={{ fontSize: 24 }}
      />
      <p>
        {selectedMelody.melody.map((key) => `${key.note}${key.modifier}, `)}
      </p>
    </div>
  ) : (
    <div />
  );
};

export default MelodyEditor;
