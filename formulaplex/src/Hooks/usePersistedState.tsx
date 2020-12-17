import { useEffect, useState } from "react";

export function usePersistedState<T>(
  key: string,
  defaultValue: any
): [T, React.Dispatch<React.SetStateAction<T>>] {
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
