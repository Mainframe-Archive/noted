// @flow

import React, { createContext } from 'react'

import { type Note } from '../types'

export type NotedContext = {
  note: ?Note,
  notes: Array<Note>,
  save: () => void,
  update: (note: Note) => void,
  key: string,
}

const DEFAULT_CONTEXT = {
  key: '',
  note: null,
  notes: [],
  save: (): void => {
    console.log('Save Note')
  },
  update: (note: Note): void => {
    console.log('Open Note', note)
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
