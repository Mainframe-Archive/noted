// @flow

import React, { Component, type Node } from 'react'
import { ThemeProvider } from 'styled-components/native'
import _ from 'lodash'

import { type Note, type ID } from '../types'

import { Provider } from '../hocs/Context'

import theme from '../theme'
import NOTES from '../notes.json'
import Home from './Home'

type State = {
  note: ?Note,
}

class App extends Component<{}, State> {
  state: State = {
    notes: _.toArray(NOTES),
    note: { key: 3, content: '<p>start typing...</p>', title: 'untitled' },
  }

  componentDidMount() {
    this.state.notes.map(note => {
      if (localStorage.hasOwnProperty(note.key)) {
        let value = localStorage.getItem(note.key)
        try {
          value = JSON.parse(value)
          const index = _.findIndex(this.state.notes, { key: note.key })
          const copy = this.state.notes
          copy.splice(index, 1, value)
          this.setState({ notes: copy })
        } catch (e) {
          console.log(e)
        }
      }
    })
  }

  updateActiveNote = note => {
    const index = _.findIndex(this.state.notes, { key: note.key })
    const copy = this.state.notes
    copy.splice(index, 1, note)
    this.setState({
      note: note,
      notes: copy,
    })
  }

  saveNote = (): void => {
    localStorage.setItem(this.state.note.key, JSON.stringify(this.state.note))
  }

  deleteNote = () => {
    console.log('deleting note... ' + this.state.note.key)
  }

  render(): Node {
    return (
      <ThemeProvider theme={theme}>
        <Provider
          value={{
            ...this.state,
            key: this.state.note.key,
            update: this.updateActiveNote,
            save: this.saveNote,
            delete: this.deleteNote,
          }}>
          <Home />
        </Provider>
      </ThemeProvider>
    )
  }
}

export default App
