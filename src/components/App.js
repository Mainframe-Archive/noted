// @flow

import React, { Component, type Node } from 'react'
import { ThemeProvider } from 'styled-components/native'
import _ from 'lodash'
import uuidv4 from 'uuid/v4'

import { type Note } from '../types'

import { Provider } from '../hocs/Context'

import theme from '../theme'
import NOTES from '../notes.json'
import Home from './Home'

type State = {
  note: ?Note,
  notes: Array<Note>,
}

class App extends Component<{}, State> {
  state: State = {
    notes: _.toArray(NOTES),
    note: {
      key: uuidv4(),
      content: 'start typing...',
      title: 'untitled',
      date: `${new Date().getTime()}`,
    },
  }

  componentDidMount() {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      let value = localStorage.getItem(key)
      try {
        value = JSON.parse(value)
        if (value.key && value.content && value.title) {
          const index = _.findIndex(this.state.notes, { key: value.key })
          const copy = this.state.notes
          if (index !== -1) {
            copy.splice(index, 1, value)
          } else {
            copy.splice(copy.length, 0, value)
          }
          this.setState({ notes: copy })
        }
      } catch {}
    }
  }

  updateActiveNote = note => {
    const copy = this.state.notes.slice()
    const index = _.findIndex(copy, { key: note.key })
    copy.splice(index, 1, note)
    this.setState({
      note: note,
      notes: copy,
    })
  }

  saveNote = (): void => {
    const note = Object.assign({}, this.state.note)
    note.date = `${new Date().getTime()}`
    const copy = this.state.notes.slice()
    const index = _.findIndex(copy, { key: note.key })
    copy.splice(index, 1, note)

    this.setState({
      note: note,
      notes: copy,
    })

    localStorage.setItem(this.state.note.key, JSON.stringify(note))
  }

  deleteNote = () => {
    console.log(
      'please note: delete not fully functional yet until integration with web3',
    )
    localStorage.removeItem(this.state.note.key)
  }

  newNote = () => {
    const newKey = uuidv4()
    const newNote = {
      key: newKey,
      title: 'untitled',
      content: 'start typing...',
      date: `${new Date().getTime()}`,
    }
    this.setState({
      notes: [...this.state.notes, newNote],
      note: newNote,
    })
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
            new: this.newNote,
          }}>
          <Home />
        </Provider>
      </ThemeProvider>
    )
  }
}

export default App
