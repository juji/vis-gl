import { useState } from "react";

export function useHistory<T>() {
  const [historyState, setHistoryState] = useState<{
    past: Array<T[]>;
    present: T[];
    future: Array<T[]>;
  }>({
    past: [],
    present: [],
    future: [],
  });

  const [hasUndo, setHasUndo] = useState(false);
  const [hasRedo, setHasRedo] = useState(false);

  function undo() {
    if (historyState.past.length === 0) return;
    const previous = historyState.past[historyState.past.length - 1];
    const newPast = historyState.past.slice(0, historyState.past.length - 1);
    const newHistoryState = {
      past: newPast,
      present: previous,
      future: [historyState.present, ...historyState.future],
    };
    setHasUndo(newHistoryState.past.length > 0);
    setHasRedo(newHistoryState.future.length > 0);
    setHistoryState(newHistoryState);
  }

  function redo() {
    if (historyState.future.length === 0) return;
    const next = historyState.future[0];
    const newFuture = historyState.future.slice(1);
    const newHistoryState = {
      past: [...historyState.past, historyState.present],
      present: next,
      future: newFuture,
    };
    setHasUndo(newHistoryState.past.length > 0);
    setHasRedo(newHistoryState.future.length > 0);
    setHistoryState(newHistoryState);
  }

  function addEntry(entry: T[]) {
    const newHistoryState = {
      past: [...historyState.past, historyState.present],
      present: entry,
      future: [],
    };
    setHasUndo(newHistoryState.past.length > 0);
    setHasRedo(newHistoryState.future.length > 0);
    setHistoryState(newHistoryState);
  }

  return {
    undo,
    redo,
    addEntry,
    hasUndo,
    hasRedo,
    present: historyState.present,
  };
}
