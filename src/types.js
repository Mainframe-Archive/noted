// @flow
export type ID = string

export type Note = {
  key: string,
  title?: string,
  content?: string,
  date?: number,
  folder?: string,
  invisible: boolean,
}
