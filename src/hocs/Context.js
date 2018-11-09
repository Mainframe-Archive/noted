// @flow

import React, { createContext } from 'react'

import { type Note, type ID } from '../types'

export type NotedContext = {
  note: ?Note,
  saveNote: (note: Note) => void,
  openNote: (noteId: ID) => void,
}

const DEFAULT_CONTEXT = {
  note: null,
  saveNote: (note: Note): void => {
    console.log('Save Note', note)
  },
  openNote: (noteId: ID): void => {
    console.log('Open Note', noteId)
  },
}

export const { Consumer, Provider } = createContext(DEFAULT_CONTEXT)

export default (Component: any) => {
  return (props: Object) => (
    <Consumer>
      {(value: NotedContext) => <Component {...props} {...value} />}
    </Consumer>
  )
}
