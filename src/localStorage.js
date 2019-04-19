import { type Note } from './types'

type Notes = Array<Note> // Ideally better type than `Object` here
const NOTES_KEY = 'notes'
const ARCHIVE_KEY = 'archive'

export const getNotes = async (): Promise<Object<Notes, Notes>> => {
  let notes = []
  let archive = []
  try {
    const notesVal = localStorage.getItem(NOTES_KEY)
    const archiveVal = localStorage.getItem(ARCHIVE_KEY)

    if (notesVal != null) {
      notes = JSON.parse(notesVal)
    }

    if (archiveVal != null) {
      archive = JSON.parse(archiveVal)
    }
  } catch (err) {
    console.warn(err)
  }
  return { notes: notes, archive: archive }
}

export const setNotes = async (notes: Notes): Promise<void> => {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
}

export const archiveNotes = async (notes: Notes): Promise<void> => {
  localStorage.setItem(ARCHIVE_KEY, JSON.stringify(notes))
}
