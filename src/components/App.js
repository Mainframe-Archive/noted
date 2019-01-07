// @flow

import React, { Component, type Node } from 'react'
import { ThemeProvider } from '@morpheus-ui/core'
import _ from 'lodash'
import uuidv4 from 'uuid/v4'
import MainframeSDK from '@mainframe/sdk'
import '@morpheus-ui/fonts'

import { ContentState, convertToRaw } from 'draft-js'
import { getNotes, setNotes, archiveNotes, getArchive } from '../localStorage'
import { type Note, type Folder } from '../types'
import { Provider } from '../hocs/Context'

import theme from '../theme'
import NOTES from '../notes.json'
import Home from './Home'

type State = {
  note: Note,
  notes: Array<Note>,
  mf: MainframeSDK,
  initial: boolean,
  apiVersion: string,
  archive: Array<Note>,
  activeFolder: Folder,
  showFolders: boolean,
}

const initialContent =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem mollis aliquam ut porttitor. Mattis aliquam faucibus purus in. Est velit egestas dui id ornare arcu. Dui vivamus arcu felis bibendum ut tristique. Vulputate ut pharetra sit amet aliquam id diam maecenas ultricies. Viverra accumsan in nisl nisi scelerisque. Sed libero enim sed faucibus turpis in eu. Scelerisque eleifend donec pretium vulputate sapien nec sagittis aliquam. Duis at consectetur lorem donec massa sapien faucibus et molestie. Sit amet risus nullam eget felis eget. Donec massa sapien faucibus et molestie ac.'

class App extends Component<{}, State> {
  state: State = {
    note: {
      key: uuidv4(),
      date: new Date().getTime(),
      folder: { name: '', type: 'empty' },
    },
    notes: _.toArray(NOTES),
    mf: new MainframeSDK(),
    initial: false,
    apiVersion: '',
    archive: [],
    activeFolder: { name: 'all notes', type: 'all' },
    showFolders: false,
  }

  async componentDidMount() {
    getNotes().then(result => {
      if (result === undefined || result.length === 0) {
        const content = ContentState.createFromText(initialContent)
        let noteContent = convertToRaw(content)
        noteContent = JSON.stringify(noteContent)
        const initialNote = {
          key: uuidv4(),
          date: new Date().getTime(),
          title: 'Welcome to Noted',
          content: noteContent,
          folder: { name: '', type: 'empty' },
        }
        this.setState({
          notes: [initialNote],
          note: initialNote,
          initial: true,
        })
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

  updateActiveNote = (note: Note, onceFound?: (Array<Note>) => void): void => {
    const copy = this.state.notes.slice()
    const index = _.findIndex(copy, { key: note.key })
    if (index === -1) {
      copy.splice(copy.length, 0, note)
    } else {
      copy.splice(index, 1, note)
    }

    onceFound && onceFound(copy)

    this.setState({
      note: note,
      notes: copy,
      initial: false,
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
      initial: false,
    })

    setNotes(copy)
  }

  updateAndSave = (note: Note): void => {
    this.updateActiveNote(note, setNotes)
  }

  deleteNote = (note?: Note) => {
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
        folder: { name: '', type: 'empty' },
      },
      notes: copy,
    })
  }

  updateArchive = (note: Note) => {
    const copy = this.state.archive.slice()
    const index = _.findIndex(copy, { key: note.key })
    if (index === -1) {
      note.folder.name = 'archive'
      note.folder.type = 'archive'
      copy.splice(copy.length, 0, note)
    } else {
      copy.splice(index, 1)
    }
    this.setState({ archive: copy })
    archiveNotes(copy)
    this.deleteNote(note)
  }

  changeFolderNames = (newFolder: string, oldFolder: string) => {
    const copy = this.state.notes.slice()
    this.state.notes.forEach(note => {
      if (note.folder.name === oldFolder) {
        note.folder.name = newFolder
        const index = _.findIndex(copy, { key: note.key })
        copy.splice(index, 1, note)
      }
    })
    this.setState({
      notes: copy,
      note: {
        key: uuidv4(),
        date: new Date().getTime(),
        folder: { name: '', type: 'empty' },
      },
    })
    setNotes(copy)
  }

  removeFolder = folder => {
    const archiveCopy = this.state.archive.slice()
    const notesCopy = this.state.notes.slice()
    const archiveTemp = []
    this.state.notes.forEach(note => {
      if (note.folder.name === folder) {
        const index = _.findIndex(notesCopy, {
          key: note.key,
        })
        notesCopy.splice(index, 1)
        const noteCopy = note
        noteCopy.folder.name = 'archive'
        noteCopy.folder.type = 'archive'
        archiveTemp.push(noteCopy)
      }
    })

    archiveCopy.push(...archiveTemp)
    archiveNotes(archiveCopy)

    this.setState(
      {
        notes: notesCopy,
        archive: archiveCopy,
        note: {
          key: uuidv4(),
          date: new Date().getTime(),
          folder: { name: '', type: 'empty' },
        },
      },
      () => console.log(this.state),
    )
  }

  isEmptyFolder = (folder: Folder) => {
    if (folder.type === 'empty' || !folder.name) {
      return true
    } else {
      return false
    }
  }

  isSystemFolder = (folder: Folder) => {
    if (folder.type === 'archive' || folder.type === 'all') {
      return true
    } else {
      return false
    }
  }

  getFolderArray = (): Array<any> => {
    const folders = []
    this.state.notes.forEach(note => {
      if (
        !this.isEmptyFolder(note.folder) &&
        !this.isSystemFolder(note.folder)
      ) {
        if (folders[note.folder.name]) {
          folders[note.folder.name] = [...folders[note.folder.name], note]
        } else {
          folders[note.folder.name] = [note]
        }
      }
    })
    return folders
  }

  setActiveFolder = (folder: Folder) => {
    this.setState({
      activeFolder: folder,
    })
  }

  toggleFoldersVisibility = () => {
    this.setState(prevState => ({
      showFolders: !prevState.showFolders,
    }))
  }

  render(): Node {
    return (
      <ThemeProvider theme={theme}>
        <Provider
          value={{
            ...this.state,
            getFolders: this.getFolderArray,
            updateFolders: this.changeFolderNames,
            removeFolder: this.removeFolder,
            setActiveFolder: this.setActiveFolder,
            toggleFoldersVisibility: this.toggleFoldersVisibility,
            updateArchive: this.updateArchive,
            archive: this.state.archive,
            key: this.state.note.key,
            update: this.updateActiveNote,
            updateAndSave: this.updateAndSave,
            save: this.saveNote,
            delete: this.deleteNote,
            getNote: this.getNoteFromKey,
          }}>
          <Home apiVersion={this.state.apiVersion} />
        </Provider>
      </ThemeProvider>
    )
  }
}

export default App
