const renderSelectedPattern = (pattern?: Pattern) => {
  if (!pattern) return null;

  return (
    <div>
      <input
        type="text"
        value={pattern.name === null ? "Pattern" : pattern.name}
        onChange={(e) => {
          const newPattern = { ...pattern, name: e.target.value };
          setPatterns(
            patterns.map((x) => (x.id === pattern.id ? newPattern : x))
          );
        }}
        style={{ fontSize: 24 }}
      />
      Length:
      <input
        type="text"
        value={pattern.length}
        onChange={(e) => {
          const newPattern = {
            ...pattern,
            length: makeIntOrZero(e.target.value),
          };
          setPatterns(
            patterns.map((x) => (x.id === pattern.id ? newPattern : x))
          );
        }}
      />
      Quantization:
      <input
        type="text"
        value={pattern.quantization}
        onChange={(e) => {
          const newPattern = {
            ...pattern,
            quantization: makeIntOrZero(e.target.value),
          };
          setPatterns(
            patterns.map((x) => (x.id === pattern.id ? newPattern : x))
          );
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          overflowY: "scroll",
        }}
      >
        {pattern.channels.map((channel, index) => {
          const instrument = instruments.find(
            (x) => x.id === channel.instrumentId
          );
          const timedMelody = timedMelodies.find(
            (x) => x.id === channel.timedMelodyId
          );

          if (instrument && timedMelody) {
            return (
              <PatternChannel
                instrument={instrument}
                timedMelody={timedMelody}
                pitch={pitch}
                channel={channel}
                patterns={patterns}
                setPatterns={setPatterns}
                patternId={pattern.id}
                channelIndex={index}
              />
            );
          } else {
            return null;
          }
        })}

        <PatternChannel
          pitch={pitch}
          onClick={() => {
            const getRandomInstrumentId = () =>
              selectRandomEntry<Instrument>(instruments).id;
            const getRandomTimedMelodyId = () =>
              selectRandomEntry<TimedMelody>(timedMelodies).id;

            //add random instrument to pattern
            const newPattern: Pattern = {
              ...pattern,
              channels: pattern.channels.concat([
                {
                  isOn: true,
                  basePitch: 4,
                  outputMixerTrack: 1,
                  panning: 1,
                  velocity: 1,
                  instrumentId: getRandomInstrumentId(),
                  timedMelodyId: getRandomTimedMelodyId(),
                },
              ]),
            };
            setPatterns(
              patterns.map((p) => (p.id === pattern.id ? newPattern : p))
            );
          }}
        />
      </div>
    </div>
  );
};
