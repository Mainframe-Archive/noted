import { type Note } from './types'

type Notes = Array<Note> // Ideally better type than `Object` here
const NOTES_KEY = 'notes'

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

export const setNotes = async (notes: Notes): Promise<void> => {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
}
