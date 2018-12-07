import { type Note } from './types'

type Notes = Array<Note> // Ideally better type than `Object` here
const NOTES_KEY = 'notes'
const ARCHIVE_KEY = 'archive'

export const getNotes = async (): Promise<Notes> => {
  let notes = []
  try {
    const value = localStorage.getItem(NOTES_KEY)
    if (value != null) {
      notes = JSON.parse(value)
    }
  } catch (err) {
    console.warn(err)
  }
  return notes
}

export const getArchive = async (): Promise<Notes> => {
  let archive = []
  try {
    const value = localStorage.getItem(ARCHIVE_KEY)
    if (value != null) {
      archive = JSON.parse(value)
    }
  } catch (err) {
    console.warn(err)
  }
  return archive
}

export const setNotes = async (notes: Notes): Promise<void> => {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
}

export const archiveNotes = async (notes: Notes): Promise<void> => {
  localStorage.setItem(ARCHIVE_KEY, JSON.stringify(notes))
}
