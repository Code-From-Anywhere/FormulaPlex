import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  actionSetSelectedTimedMelodyId,
  actionSetTimedMelodies,
} from "../Context/Actions";
import {
  selectSelectedTimedMelody,
  selectTimedMelodies,
} from "../Context/Selectors";
import { Key, KeyTime, TimedMelody } from "../Types/Types";

const TimedMelodyEditor = () => {
  const dispatch = useDispatch();
  const selectedTimedMelody = useSelector(selectSelectedTimedMelody);
  const timedMelodies = useSelector(selectTimedMelodies);
  const setSelectedTimedMelodyId = (id: string) =>
    dispatch(actionSetSelectedTimedMelodyId(id));
  const setTimedMelodies = (timedMelodies: TimedMelody[]) =>
    dispatch(actionSetTimedMelodies(timedMelodies));

  return selectedTimedMelody ? (
    <div>
      <input
        type="text"
        value={
          selectedTimedMelody.name === null
            ? "Timed Melody"
            : selectedTimedMelody.name
        }
        onChange={(e) => {
          const newTimedMelody = {
            ...selectedTimedMelody,
            name: e.target.value,
          };
          setSelectedTimedMelodyId(newTimedMelody.id);
          setTimedMelodies(
            timedMelodies.map((x) =>
              x.id === selectedTimedMelody.id ? newTimedMelody : x
            )
          );
        }}
      />

      <div style={{ display: "flex", flexDirection: "column" }}>
        <table>
          <tr>
            <th>Note</th>
            <th>Start</th>
            <th>Duration</th>
          </tr>
          {selectedTimedMelody.timedMelody.map((key, index) => (
            <tr>
              <td align="center">
                {key.note}
                {key.modifier}
              </td>

              <td align="center">
                <input
                  key={`pauseEnd${index}${selectedTimedMelody.id}`}
                  type="text"
                  value={key.startPosition}
                  onChange={(e) => {
                    const newKey: Key & KeyTime = {
                      ...key,
                      startPosition: !isNaN(parseInt(e.target.value))
                        ? parseInt(e.target.value)
                        : 0,
                    };
                    const newTimedMelody = {
                      ...selectedTimedMelody,
                      timedMelody: selectedTimedMelody.timedMelody.map((k, i) =>
                        i === index ? newKey : k
                      ),
                    };

                    setSelectedTimedMelodyId(newTimedMelody.id);
                    setTimedMelodies(
                      timedMelodies.map((x) =>
                        x.id === selectedTimedMelody.id ? newTimedMelody : x
                      )
                    );
                  }}
                />
              </td>

              <td align="center">
                <input
                  key={`duration${index}${selectedTimedMelody.id}`}
                  type="text"
                  value={key.duration}
                  onChange={(e) => {
                    const newKey = {
                      ...key,
                      duration: !isNaN(parseInt(e.target.value))
                        ? parseInt(e.target.value)
                        : 0,
                    };
                    const newTimedMelody = {
                      ...selectedTimedMelody,
                      timedMelody: selectedTimedMelody.timedMelody.map((k, i) =>
                        i === index ? newKey : k
                      ),
                    };

                    setSelectedTimedMelodyId(newTimedMelody.id);
                    setTimedMelodies(
                      timedMelodies.map((x) =>
                        x.id === selectedTimedMelody.id ? newTimedMelody : x
                      )
                    );
                  }}
                />
              </td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  ) : (
    <div />
  );
};
export default TimedMelodyEditor;
