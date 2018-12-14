// @flow
export type ID = string

import constantMirror from 'constant-mirror'

// Creates {normal: "normal", empty: "empty", ...}
const folderTypes = constantMirror('normal', 'empty', 'archive', 'all')

// See https://alligator.io/react/flow-enums/
export type FolderType = $Keys<typeof folderTypes>

export type Folder = {
  name: string,
  type: FolderType,
}

export type Note = {
  key: string,
  title?: string,
  content?: string,
  date: number,
  folder: Folder,
  invisible?: boolean,
}
