// @flow

import React, { Component, type Node } from 'react'
import { ThemeProvider as NativeThemeProvider } from 'styled-components/native'
import { ThemeProvider as ComponentsThemeProvider } from '@morpheus-ui/core'
import _ from 'lodash'
import uuidv4 from 'uuid/v4'
import MainframeSDK from '@mainframe/sdk'
import '@morpheus-ui/fonts'

import { getNotes, setNotes, archiveNotes, getArchive } from '../localStorage'
import { type Note } from '../types'

import { Provider } from '../hocs/Context'

import theme from '../theme'
import NOTES from '../notes.json'
import Home from './Home'

type State = {
  note: Note,
  notes: Array<Note>,
  mf: MainframeSDK,
  apiVersion: string,
  initial: boolean,
  archive: Array<Note>,
}

class App extends Component<{}, State> {
  state: State = {
    note: {
      key: uuidv4(),
      date: new Date().getTime(),
      folder: '',
    },
    notes: _.toArray(NOTES),
    mf: new MainframeSDK(),
    apiVersion: '',
    archive: [],
    initial: false,
  }

  async componentDidMount() {
    getNotes().then(result => {
      if (result === undefined || result.length === 0) {
        this.setState({ notes: _.toArray(NOTES), initial: true })
        setNotes(NOTES)
      } else {
        this.setState({ notes: _.toArray(result) })
      }
    })
    getArchive().then(result => {
      this.setState({ archive: _.toArray(result) })
    })
    this.setState({ apiVersion: await this.state.mf.apiVersion() })
  }

  getNoteFromKey = (key: string): ?Note => {
    const note = this.state.notes.find(note => note.key === key)
    return note ? note : null
  }

  updateActiveNote = (note: Note): void => {
    const copy = this.state.notes.slice()
    const index = _.findIndex(copy, { key: note.key })
    if (index === -1) {
      copy.splice(copy.length, 0, note)
    } else {
      copy.splice(index, 1, note)
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

  updateAndSave = (note: Note): void => {
    const copy = this.state.notes.slice()
    const index = _.findIndex(copy, { key: note.key })
    if (index === -1) {
      copy.splice(copy.length, 0, note)
    } else {
      copy.splice(index, 1, note)
    }
    setNotes(copy)

    this.setState({
      note: note,
      notes: copy,
    })
  }

  deleteNote = (note?: Note) => {
    console.log(
      'please note: delete not fully functional yet until integration with web3',
    )
    const copy = this.state.notes.slice()
    const index = _.findIndex(copy, {
      key: note ? note.key : this.state.note.key,
    })
    copy.splice(index, 1)
    setNotes(copy)

    this.setState({
      note: {
        key: uuidv4(),
        date: new Date().getTime(),
        folder: '',
      },
      notes: copy,
    })
  }

  archiveNote = (note: Note) => {
    const copy = this.state.archive.slice()
    const index = _.findIndex(copy, { key: note.key })
    if (index === -1) {
      copy.splice(copy.length, 0, note)
    } else {
      copy.splice(index, 1)
    }
    this.setState({ archive: copy })
    archiveNotes(copy)
    this.deleteNote(note)
  }

  setInitialFalse = () => {
    this.setState({ initial: false })
  }

  changeFolderNames = (newFolder: string, oldFolder: string) => {
    const copy = this.state.notes.slice()
    this.state.notes.forEach(note => {
      if (note.folder === oldFolder) {
        note.folder = newFolder
        const index = _.findIndex(copy, { key: note.key })
        copy.splice(index, 1, note)
      }
    })
    this.setState({
      notes: copy,
      note: {
        key: uuidv4(),
        date: new Date().getTime(),
        folder: '',
      },
    })
    setNotes(copy)
  }

  getFolderArray = (): Array<any> => {
    const folders = []
    this.state.notes.forEach(note => {
      if (note.folder !== '') {
        if (folders[note.folder]) {
          folders[note.folder] = [...folders[note.folder], note]
        } else {
          folders[note.folder] = [note]
        }
      }
    })
    return folders
  }

  render(): Node {
    return (
      <NativeThemeProvider theme={theme.native}>
        <ComponentsThemeProvider theme={theme.components} >
          <Provider
            value={{
              ...this.state,
              getFolders: this.getFolderArray,
              updateFolders: this.changeFolderNames,
              updateArchive: this.archiveNote,
              archive: this.state.archive,
              key: this.state.note.key,
              update: this.updateActiveNote,
              updateAndSave: this.updateAndSave,
              save: this.saveNote,
              delete: this.deleteNote,
              getNote: this.getNoteFromKey,
            }}>
            <Home
              initial={this.state.initial}
              apiVersion={this.state.apiVersion}
              setInitialFalse={this.setInitialFalse}
            />
          </Provider>
        </ComponentsThemeProvider>
      </NativeThemeProvider>
    )
  }
}

export default App
