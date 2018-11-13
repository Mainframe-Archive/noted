// @flow

import React, { Component, type Node } from 'react'
import { ThemeProvider } from 'styled-components/native'

import { type Note, type ID } from '../types'

import { Provider } from '../hocs/Context'

import theme from '../theme'

import Home from './Home'

type State = {
  note: ?Note,
}

class App extends Component<{}, State> {
  state: State = {
    note: { key: 1, content: '<p>start typing...</p>', title: 'untitled' },
  }

  saveNote = (note: Note): void => {
    console.log('Save Note', note)
  }

  openNote = (noteId: ID): void => {
    console.log('Open Note', noteId)
  }

  updateActiveNote = note => {
    console.log(note)
    this.setState({ note: note })
  }

  render(): Node {
    return (
      <ThemeProvider theme={theme}>
        <Provider
          value={{
            ...this.state,
            saveNote: this.saveNote,
            openNote: this.openNote,
            update: this.updateActiveNote,
          }}>
          <Home />
        </Provider>
      </ThemeProvider>
    )
  }
}

export default App
