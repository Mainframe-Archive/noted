// @flow

import React, { Component } from 'react'
import styled, { css } from 'styled-components/native'
import { View } from 'react-native-web'
import { Button } from '@morpheus-ui/core'
import uuidv4 from 'uuid/v4'
import { type Note, type Folder as FolderType } from '../types'
import applyContext from '../hocs/Context'
import screenSize from '../hocs/ScreenSize'
import Folder from './Folder'
import Notes from './Notes'
import SearchBar from './Search'

type Props = {
  note: Note,
  notes: Array<Note>,
  update: (Note, ?boolean) => void,
  updateAndSave: (Note, ?boolean) => void,
  archive: Array<Note>,
  updateArchive: Note => void,
  updateFolders: (string, string) => void,
  showFolders: boolean,
  setActiveFolder: FolderType => void,
  toggleFoldersVisibility: () => void,
  activeFolder: FolderType,
  getFolders: () => Array<Note>,
  getNote: string => Note,
}

type State = {
  edit: boolean,
  newTitle: string,
  addFolder: string,
  newFolder: string,
}

const Container = screenSize(styled.View`
  width: 250px;
  height: 100%;
  background-color: ${props => props.theme.lightGray};
  display: flex;
  flex-direction: row;
  ${props =>
    props.screenWidth <= 900 &&
    css`
      width: 100px;
    `};
  ${props =>
    props.showFolders &&
    css`
      width: 500px;
    `};
`)

const SidebarContainer = screenSize(styled.View`
  width: 100%;
  background-color: ${props => props.theme.lightGray};
  ${props =>
    props.screenWidth <= 900 &&
    css`
      width: 50px;
    `};
  ${props =>
    props.showFolders &&
    css`
      width: 55%;
    `};
  ${props =>
    props.folder &&
    css`
      padding: ${props => props.theme.spacing};
      display: flex;
      justify-content: space-between;
      background-color: #e9e9e9;
      height: 100%;
      width: 45%;
    `};
`)

const SearchContainer = styled.View`
  display: flex;
  align-items: center;
  padding: ${props => props.theme.spacing};
`

const NewButtonContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`

class LeftNav extends Component<Props, State> {
  count: number
  timeout: TimeoutID

  constructor(props) {
    super(props)
    this.count = 0
  }

  state = {
    edit: false,
    newTitle: '',
    addFolder: '',
    newFolder: '',
  }

  addFolder = () => {
    this.props.update({
      key: uuidv4(),
      invisible: true,
      folder: { name: 'new folder', type: 'normal' },
      date: new Date().getTime(),
    })
  }

  handleClick = item => {
    this.props.update(item)
  }

  handleDoubleClick = () => {
    this.setState({
      edit: true,
    })
  }

  findInArchive = (key: string) => {
    const note = this.props.archive.find(note => note.key === key)
    return note
  }

  updateText = text => {
    this.setState({ newTitle: text })
  }

  updateFolder = text => {
    this.setState({ newFolder: text })
  }

  onDragOver = e => {
    e.preventDefault()
  }

  onDragStart = (e, key) => {
    e.dataTransfer.setData('key', key)
  }

  onDrop = (e, targetFolder) => {
    const key = e.dataTransfer.getData('key')
    const note = Object.assign(
      {},
      this.props.getNote(key)
        ? this.props.getNote(key)
        : this.findInArchive(key),
    )
    note.folder.type === 'archive' && this.props.updateArchive(note)

    note.folder.name = targetFolder.name
    // folderName === 'archive'
    //   ? (note.folder.type = 'archive')
    //   : folder === 'all notes'
    //   ? (note.folder.type = 'all')
    //   : (note.folder.type = 'normal')
    switch (targetFolder.type) {
      case 'all':
      case 'archive':
        note.folder.type = targetFolder.type
        break
      default:
        note.folder.type = 'normal'
    }

    console.log(note)
    this.props.updateAndSave(note)
  }

  archiveNote = e => {
    const key = e.dataTransfer.getData('key')
    const note = Object.assign({}, this.props.getNote(key))
    this.props.updateArchive(note)
  }

  render() {
    // console.log(
    //   Object.values(this.props.getFolders()).sort((a, b) => {
    //     if (a[0].date < b[0].date) return -1
    //     if (a[0].date > b[0].date) return -1
    //     return 0
    //   }),
    // )
    return (
      <Container showFolders={this.props.showFolders}>
        {this.props.showFolders && (
          <SidebarContainer folder showFolders={this.props.showFolders}>
            <View>
              <Folder
                folder={{ name: 'all notes', type: 'all' }}
                folderID={'all notes'}
                isBeingEdited={false}
                onDragOver={this.onDragOver}
                onDrop={this.onDrop}
                isOpen={this.props.activeFolder.name === 'all notes'}
                handleClick={() =>
                  this.props.setActiveFolder({ name: 'all notes', type: 'all' })
                }
                handleDoubleClick={this.handleDoubleClick}
              />
              {Object.values(this.props.getFolders()).map(
                (subArray: Array<Note>, index: number) => {
                  const folderDataFromNote = subArray[0]
                  return (
                    <View key={folderDataFromNote.key}>
                      <Folder
                        folderID={folderDataFromNote.key}
                        folder={{
                          name: folderDataFromNote.folder.name,
                          type: 'normal',
                        }}
                        onDragOver={this.onDragOver}
                        onDrop={this.onDrop}
                        onChangeText={this.updateFolder}
                        onSubmitEditing={() => {
                          this.props.updateFolders(
                            this.state.newFolder,
                            folderDataFromNote.folder.name,
                          )
                          this.setState({ edit: false })
                        }}
                        isBeingEdited={this.state.edit}
                        isOpen={
                          this.props.activeFolder.name ===
                          folderDataFromNote.folder.name
                        }
                        handleClick={() =>
                          this.props.setActiveFolder({
                            name: folderDataFromNote.folder.name,
                            type: folderDataFromNote.folder.type,
                          })
                        }
                        handleDoubleClick={this.handleDoubleClick}
                      />
                    </View>
                  )
                },
              )}
              <Folder
                folder={{ name: 'archive', type: 'archive' }}
                folderID={'archive'}
                isBeingEdited={false}
                isOpen={this.props.activeFolder.type === 'archive'}
                onDragOver={this.onDragOver}
                onDrop={this.onDrop}
                archive={this.archiveNote}
                handleClick={() =>
                  this.props.setActiveFolder({
                    name: 'archive',
                    type: 'archive',
                  })
                }
                handleDoubleClick={this.handleDoubleClick}
              />
            </View>
            <NewButtonContainer>
              <Button title="NEW FOLDER" onPress={this.addFolder} />
            </NewButtonContainer>
          </SidebarContainer>
        )}
        <SidebarContainer showFolders={this.props.showFolders}>
          <NewButtonContainer>
            <Button
              onPress={this.props.toggleFoldersVisibility}
              title="FOLDERS"
            />
            <Button
              onPress={() =>
                this.props.update({
                  key: uuidv4(),
                  date: new Date().getTime(),
                  folder: { name: '', type: 'empty' },
                })
              }
              title="NEW NOTE"
            />
          </NewButtonContainer>
          <SearchContainer>
            <SearchBar data={this.props.notes} />
          </SearchContainer>
          {Object.values(this.props.getFolders()).map(
            (subArray: Array<Note>, index: number) => {
              return (
                <View key={subArray[0].key}>
                  <Notes
                    data={subArray.sort((a, b) => b.date - a.date)}
                    folderName={
                      subArray[0].folder.name && subArray[0].folder.name
                    }
                    activeNote={this.props.note}
                    isOpen={
                      this.props.activeFolder.name === subArray[0].folder.name
                    }
                    dragStart={this.onDragStart}
                    handleClick={this.handleClick}
                  />
                </View>
              )
            },
          )}
          <Notes
            data={this.props.notes.sort((a, b) => b.date - a.date)}
            folderName={'all notes'}
            activeNote={this.props.note}
            isOpen={this.props.activeFolder.type === 'all'}
            dragStart={this.onDragStart}
            handleClick={this.handleClick}
          />
          <Notes
            data={this.props.archive.sort((a, b) => b.date - a.date)}
            folderName={'archive'}
            activeNote={this.props.note}
            isOpen={this.props.activeFolder.type === 'archive'}
            dragStart={this.onDragStart}
            handleClick={this.handleClick}
          />
        </SidebarContainer>
      </Container>
    )
  }
}

export default applyContext(LeftNav)
