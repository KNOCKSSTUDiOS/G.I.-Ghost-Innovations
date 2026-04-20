// G.I. FILE STORAGE ENGINE — Core
// Handles file uploads, metadata, and retrieval.

import fs from "fs";
import path from "path";

const STORAGE_ROOT = path.join(process.cwd(), "storage");

export interface GiStoredFile {
  id: string;
  user_id: string;
  project?: string;
  filename: string;
  path: string;
  size: number;
  mime: string;
  created: number;
}

const fileIndex: GiStoredFile[] = [];

// Ensure storage root exists
if (!fs.existsSync(STORAGE_ROOT)) {
  fs.mkdirSync(STORAGE_ROOT);
}

// ---------- SAVE FILE ----------
export function saveFile(
  user_id: string,
  buffer: Buffer,
  filename: string,
  mime: string,
  project?: string
): GiStoredFile {
  const id = "file-" + Math.random().toString(36).substring(2, 10);
  const folder = project ? `${user_id}/${project}` : `${user_id}`;

  const dir = path.join(STORAGE_ROOT, folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, buffer);

  const record: GiStoredFile = {
    id,
    user_id,
    project,
    filename,
    path: filePath,
    size: buffer.length,
    mime,
    created: Date.now()
  };

  fileIndex.push(record);
  return record;
}

// ---------- GET FILE ----------
export function getFile(id: string) {
  return fileIndex.find(f => f.id === id);
}

//
