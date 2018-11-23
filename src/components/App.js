// @flow

import React, { Component, type Node } from 'react'
import { ThemeProvider } from 'styled-components/native'
import _ from 'lodash'
import uuidv4 from 'uuid/v4'

// import { getLSKey } from '../localstorage'
import { type Note } from '../types'

import { Provider } from '../hocs/Context'

import theme from '../theme'
import NOTES from '../notes.json'
import Home from './Home'

type State = {
  note: Note,
  notes: Array<Note>,
  sessionKey: string,
}

class App extends Component<{}, State> {
  state: State = {
    sessionKey: '',
    note: {
      key: uuidv4(),
      content: 'start typing...',
      title: 'untitled',
      date: new Date().getTime(),
    },
    notes: _.toArray(NOTES),
  }

  componentDidMount() {
    // writing key to final storage probably not final solution,
    // maybe key can be related to public key or smthg
    !localStorage.getItem('local-storage-session-key') &&
      localStorage.setItem('local-storage-session-key', uuidv4())
    const sessionKey = localStorage.getItem('local-storage-session-key') || ''

    this.setState({ sessionKey: sessionKey })

    !localStorage.getItem(sessionKey) &&
      localStorage.setItem(sessionKey, JSON.stringify(NOTES))
    let newData = localStorage.getItem(sessionKey) || '{}'

    try {
      newData = JSON.parse(newData)
      this.setState({ notes: newData })
    } catch (e) {
      console.log(e)
    }
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

    localStorage.setItem(this.state.sessionKey, JSON.stringify(copy))
  }

  deleteNote = (): void => {
    console.log(
      'please note: delete not fully functional yet until integration with web3',
    )
    const copy = this.state.notes.slice()
    const index = _.findIndex(copy, { key: this.state.note.key })
    copy.splice(index, 1)
    localStorage.setItem(this.state.sessionKey, JSON.stringify(copy))

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
