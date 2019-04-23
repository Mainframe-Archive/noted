// @flow

import React, { Component, type Node } from 'react'
import { ThemeProvider } from '@morpheus-ui/core'
import _ from 'lodash'
import uuidv4 from 'uuid/v4'
import MainframeSDK from '@mainframe/sdk'
import '@morpheus-ui/fonts'
import styled from 'styled-components/native'

import { ContentState, convertToRaw } from 'draft-js'
import { getNotes, setNotes, archiveNotes } from '../localStorage'
import { type Note, type Folder } from '../types'
import { Provider } from '../hocs/Context'

import theme from '../theme'
import ConfirmationModal from './ConfirmationModal'
import NetworkBanner from './NetworkBanner'
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
  showRenameModal: boolean,
}

const Container = styled.View`
  width: 100%;
  height: 100%;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
`

const BannerContainer = styled.View`
  display: flex;
`

const NormalContainer = styled.View`
  display: flex;
  flex-direction: row;
`

const initialContent =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem mollis aliquam ut porttitor. Mattis aliquam faucibus purus in. Est velit egestas dui id ornare arcu. Dui vivamus arcu felis bibendum ut tristique. Vulputate ut pharetra sit amet aliquam id diam maecenas ultricies. Viverra accumsan in nisl nisi scelerisque. Sed libero enim sed faucibus turpis in eu. Scelerisque eleifend donec pretium vulputate sapien nec sagittis aliquam. Duis at consectetur lorem donec massa sapien faucibus et molestie. Sit amet risus nullam eget felis eget. Donec massa sapien faucibus et molestie ac.'

class App extends Component<{}, State> {
  state: State = {
    note: {
      key: uuidv4(),
      date: new Date().getTime(),
      folder: { name: '', type: 'empty' },
    },
    notes: _.toArray({}),
    mf: new MainframeSDK(),
    initial: false,
    apiVersion: '',
    archive: [],
    activeFolder: { name: 'all notes', type: 'all' },
    showFolders: false,
    showRenameModal: false,
    backupResult: '',
  }

  async componentDidMount() {
    getNotes().then(result => {
      if (result.notes.length === 0 && result.archive.length === 0) {
        this.state.mf.storage.get('stringifiedNotes').then(data => {
          // local storage & swarm empty, so initialize
          // don't write yet until dirty
          // TODO revisit if i should write when dirty? mayeb more cost effective
          if (data === undefined || data === '') {
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
          }
          // no local storage but swarm, retrieve from swarm
          // then write to local storage
          else {
            const parsedData = JSON.parse(data)
            const archive = parsedData.archive
            const notes = parsedData.notes
            this.setState({
              notes: _.toArray(notes),
              archive: _.toArray(archive),
            })
            setNotes(_.toArray(notes))
            archiveNotes(_.toArray(archive))
          }
        })
        // if local storage then load from local storage
      } else {
        this.setState({
          notes: _.toArray(result.notes),
          archive: _.toArray(result.archive),
        })
      }
    })

    // add interval call to write to swarm as backup
    this.interval = setInterval(() => {
      if (this.state && this.state.notes && this.state.archive) {
        this.state.mf.storage
          .set(
            'stringifiedNotes',
            JSON.stringify({
              notes: this.state.notes,
              archive: this.state.archive,
            }),
          )
          .then(response => {
            this.setState({
              backupResult:
                'Your notes have been successfully backed up to Swarm',
            })
          })
          .catch(err => {
            this.setState({
              backupResult:
                'Your notes were not backed up. Trying again in 5 minutes.',
            })
          })
      }
    }, 300000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
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
      const archiveFolder = { name: 'archive', type: 'archive' }
      note.folder = archiveFolder
      copy.splice(copy.length, 0, note)
    } else {
      copy.splice(index, 1)
    }
    this.setState({ archive: copy })
    archiveNotes(copy)
    this.deleteNote(note)
  }

  changeFolderNames = (newFolder: string, oldFolder: Folder) => {
    const folders = Object.values(this.getFolderArray())
    let hasRenamingConflict = false
    folders.forEach(subArray => {
      const folder = subArray[0].folder.name
      if (newFolder === folder) {
        hasRenamingConflict = true
      }
    })

    if (!hasRenamingConflict) {
      const copy = this.state.notes.slice()
      const folderMatch = this.findSameFolder(this.state.notes, oldFolder)

      folderMatch.forEach(note => {
        const folder = { name: newFolder, type: 'normal' }
        note.folder = folder
        const index = _.findIndex(copy, { key: note.key })
        copy.splice(index, 1, note)
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
    } else {
      this.setState({
        showRenameModal: hasRenamingConflict,
      })
    }
  }

  findSameFolder = (notes: Array<Note>, targetFolder: Folder) => {
    const folderMatches = notes.filter(
      note =>
        note.folder.name === targetFolder.name &&
        note.folder.type === targetFolder.type,
    )
    return folderMatches
  }

  removeFolder = (folder: Folder) => {
    const archiveCopy = this.state.archive.slice()
    const notesCopy = this.state.notes.slice()
    const archiveTemp = []

    const folderMatch = this.findSameFolder(this.state.notes, folder)

    folderMatch.forEach(note => {
      const index = _.findIndex(notesCopy, {
        key: note.key,
      })
      notesCopy.splice(index, 1)
      const noteCopy = note
      const archiveFolder = { name: 'archive', type: 'archive' }
      noteCopy.folder = archiveFolder
      archiveTemp.push(noteCopy)
    })

    archiveCopy.push(...archiveTemp)
    archiveNotes(archiveCopy)
    setNotes(notesCopy)

    this.setState({
      notes: notesCopy,
      archive: archiveCopy,
      note: {
        key: uuidv4(),
        date: new Date().getTime(),
        folder: { name: '', type: 'empty' },
      },
    })
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
    const foldersCopy = folders
    foldersCopy.sort((a, b) => {
      let nameA = a[0].folder.name.toLowerCase(),
        nameB = b[0].folder.name.toLowerCase()
      if (nameA < nameB) return -1
      if (nameA > nameB) return 1
      return 0
    })
    return foldersCopy
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

  closeRenameModal = () => {
    this.setState({ showRenameModal: false })
  }

  dismissBanner = () => {
    this.setState({ backupResult: '' })
  }

  discardChanges = () => {
    this.setState({
      showRenameModal: false,
      activeFolder: { name: 'all notes', type: 'all' },
      note: {
        key: uuidv4(),
        date: new Date().getTime(),
        folder: { name: '', type: 'empty' },
      },
    })
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
            dismissBanner: this.dismissBanner,
          }}>
          <Container>
            <BannerContainer>
              <NetworkBanner visible={this.state.backupResult !== ''} />
            </BannerContainer>
            <NormalContainer>
              <Home />
              <ConfirmationModal
                show={this.state.showRenameModal}
                question={
                  'This folder name is already in use. Please rename the folder.'
                }
                confirmationOption={'discard changes'}
                confirmationFunction={this.discardChanges}
                cancelOption={'cancel'}
                close={this.closeRenameModal}
              />
            </NormalContainer>
          </Container>
        </Provider>
      </ThemeProvider>
    )
  }
}

export default App
