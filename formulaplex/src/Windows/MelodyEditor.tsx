const renderSelectedMelody = (selectedMelody: Melody) => (
  <div>
    <input
      type="text"
      value={selectedMelody.name === null ? "Melody" : selectedMelody.name}
      onChange={(e) => {
        const newMelody = { ...selectedMelody, name: e.target.value };
        setSelectedMelody(newMelody);
        setMelodies(
          melodies.map((x) => (x.id === selectedMelody.id ? newMelody : x))
        );
      }}
      style={{ fontSize: 24 }}
    />
    <p>{selectedMelody.melody.map((key) => `${key.note}${key.modifier}, `)}</p>
  </div>
);
