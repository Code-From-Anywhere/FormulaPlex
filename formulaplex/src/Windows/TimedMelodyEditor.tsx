const renderSelectedTimedMelody = (selectedTimedMelody: TimedMelody) => {
  return (
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
          setSelectedTimedMelody(newTimedMelody);
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

                    setSelectedTimedMelody(newTimedMelody);
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

                    setSelectedTimedMelody(newTimedMelody);
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
  );
};
