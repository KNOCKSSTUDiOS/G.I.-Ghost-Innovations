// G.I. UPDATE ENGINE
// Tracks OS versions, patches, and update notes

export interface GiUpdate {
  id: string;
  version: string;
  notes: string;
  date: number;
}

const updates: GiUpdate[] = [];

export function pushUpdate(version: string, notes: string) {
  const u: GiUpdate = {
    id: "upd-" + Math.random().toString(36).substring(2, 10),
    version,
    notes,
    date: Date.now()
  };
  updates.push(u);
  return u;
}

export function listUpdates() {
  return updates;
}

