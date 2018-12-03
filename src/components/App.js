// @flow

import React, { Component, type Node } from 'react'
import { ThemeProvider } from 'styled-components/native'
import _ from 'lodash'
import uuidv4 from 'uuid/v4'
import { getNotes, setNotes } from '../localStorage'
import { type Note } from '../types'

import { Provider } from '../hocs/Context'

import theme from '../theme'
import NOTES from '../notes.json'
import Home from './Home'

type State = {
  note: Note,
  notes: Array<Note>,
  initial: boolean,
}

class App extends Component<{}, State> {
  state: State = {
    note: {
      key: uuidv4(),
      content: 'start typing...',
      title: 'untitled',
      date: new Date().getTime(),
    },
    notes: _.toArray(NOTES),
    initial: false,
  }

  componentDidMount() {
    getNotes().then(result => {
      if (result === undefined || result.length === 0) {
        this.setState({ notes: _.toArray(NOTES), initial: true })
        setNotes(NOTES)
      } else {
        this.setState({ notes: _.toArray(result) })
      }
    })
  }

  getNoteFromKey = (key: string): Note => {
    const note = this.state.notes.find(note => note.key === key)
    return note
  }

  updateActiveNote = (note: Note, save?: boolean): void => {
    const copy = this.state.notes.slice()
    const index = _.findIndex(copy, { key: note.key })
    if (index === -1) {
      copy.splice(copy.length, 0, note)
    } else {
      copy.splice(index, 1, note)
    }

    if (save) {
      setNotes(copy)
    }

    this.setState({
      note: note,
      notes: copy,
    })
  }

  saveNote = (): void => {
    const note = Object.assign({}, this.state.note)
    note.date = new Date().getTime()
    const copy = this.state.notes.slice()
    const index = _.findIndex(copy, { key: note.key })
    copy.splice(index, 1, note)

    this.setState({
      note: note,
      notes: copy,
    })

    setNotes(copy)
  }

  deleteNote = (): void => {
    console.log(
      'please note: delete not fully functional yet until integration with web3',
    )
    const copy = this.state.notes.slice()
    const index = _.findIndex(copy, { key: this.state.note.key })
    copy.splice(index, 1)
    setNotes(copy)

    this.setState({
      note: {
        key: uuidv4(),
        content: 'start typing...',
        title: 'untitled',
        date: new Date().getTime(),
      },
      notes: copy,
    })
  }

  setInitialFalse = () => {
    this.setState({ initial: false })
  }

  updateFolderNames = (newFolder, oldFolder) => {
    const copy = this.state.notes.slice()
    this.state.notes.map(note => {
      if (note.folder === oldFolder) {
        note.folder = newFolder
        const index = _.findIndex(copy, { key: note.key })
        copy.splice(index, 1, note)
      } else {
        const index = _.findIndex(copy, { key: note.key })
        copy.splice(index, 1, note)
      }
      return copy
    })
    this.setState({
      notes: copy,
      note: {
        key: uuidv4(),
        title: 'untitled',
        content: 'start typing...',
        date: new Date().getTime(),
      },
    })
    setNotes(copy)
  }

  getFolderArray = () => {
    const folders = []
    this.state.notes.map(note => {
      if (note.folder !== undefined) {
        if (folders[note.folder]) {
          const all = folders[note.folder]
          folders[note.folder] = [...all, note]
        } else {
          folders[note.folder] = [note]
        }
      } else {
        folders[''] = [note]
      }
      return folders
    })

    if (this.state.addFolder) {
      folders[this.state.addFolder] = []
    }

    return folders
  }

  render(): Node {
    return (
      <ThemeProvider theme={theme}>
        <Provider
          value={{
            ...this.state,
            folders: this.getFolderArray(),
            updateFolders: this.updateFolderNames,
            key: this.state.note.key,
            update: this.updateActiveNote,
            save: this.saveNote,
            delete: this.deleteNote,
            getNote: this.getNoteFromKey,
          }}>
          <Home
            initial={this.state.initial}
            setInitialFalse={this.setInitialFalse}
          />
        </Provider>
      </ThemeProvider>
    )
  }
}

export default App
