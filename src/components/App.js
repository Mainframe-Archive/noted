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
    note: {
      key: `${new Date().getTime()}`,
      content: '<p>start typing...</p>',
      title: 'untitled',
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
    console.log(
      'please note: delete not fully functional yet until integration with web3 DB',
    )
    localStorage.removeItem(this.state.note.key)
  }

  generateNewKey = () => {
    return `${new Date().getTime()}`
  }

  newNote = () => {
    console.log('opening new note... ')
    const newKey = this.generateNewKey()
    this.setState({
      notes: [
        ...this.state.notes,
        { key: newKey, title: 'untitled', content: '<p>start typing</p>' },
      ],
      note: {
        key: newKey,
        title: 'untitled',
        content: '<p>start typing</p>',
      },
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
