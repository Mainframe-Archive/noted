// @flow

import React, { Component } from 'react'
import styled, { css } from 'styled-components/native'
import { View } from 'react-native-web'
import { Button } from '@morpheus-ui/core'
import { PlusSymbolSm } from '@morpheus-ui/icons'
import { Image } from 'react-native-web'
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
  updateFolders: (string, FolderType) => void,
  showFolders: boolean,
  setActiveFolder: FolderType => void,
  toggleFoldersVisibility: () => void,
  activeFolder: FolderType,
  getFolders: () => Array<Note>,
  removeFolder: FolderType => void,
  getNote: string => Note,
}

type State = {
  edit: boolean,
  newTitle: string,
  addFolder: string,
  newFolder: string,
  searchOpen: boolean,
}

const Container = screenSize(styled.View`
  width: 220px;
  height: 100%;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: row;
  ${props =>
    props.showFolders &&
    css`
      width: 390px;
    `};
  ${props =>
    props.screenWidth <= 700 &&
    css`
      width: 0;
    `};
`)

const SidebarContainer = styled.View`
  width: 100%;
  background-color: #f9f9f9;
  overflow-y: auto;
  ${props =>
    props.showFolders &&
    css`
      width: 220px;
    `};
  ${props =>
    props.folder &&
    css`
      padding: ${props => props.theme.spacing} 0;
      display: flex;
      background-color: #f5f5f5;
      height: 100%;
      width: 170px;
    `};
`

const NewButtonContainer = styled.View`
  position: relative;
  margin: 0 auto;
  width: 205px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`

const SideBarButtonContainer = styled.View`
  margin-left: 20px;
  margin-top: 15px;
`

const MarginTop = styled.View`
  margin-top: 30px;
  margin-bottom: 15px;
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
    searchOpen: false,
  }

  findMaxStringNumber = (nameArray: Array<string>, regex: RegExp): number => {
    let currentMax = 0
    nameArray.forEach(name => {
      const maxNumberName = name.match(regex)
      if (maxNumberName) {
        const getNumber = maxNumberName[1] ? maxNumberName[1] : 0
        currentMax = Math.max(parseInt(getNumber) + 1, currentMax)
      }
    })
    return currentMax
  }

  prettifyFolderName = (number: number): string => {
    const folderName = number !== 0 ? 'new folder ' + number : 'new folder'
    return folderName
  }

  addFolder = () => {
    const folderNames = Object.keys(this.props.getFolders())
    const regex = /new folder\s*(\d*)/
    const maxFolderNumber = this.findMaxStringNumber(folderNames, regex)
    const nextFolderName = this.prettifyFolderName(maxFolderNumber)

    this.props.update({
      key: uuidv4(),
      invisible: true,
      folder: {
        name: nextFolderName,
        type: 'normal',
      },
      date: new Date().getTime(),
    })
    this.props.setActiveFolder({ name: nextFolderName, type: 'normal' })
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

  onFolderDragStart = (e, folder) => {
    e.dataTransfer.setData('folder', JSON.stringify(folder))
  }

  onDrop = (e, targetFolder) => {
    const key = e.dataTransfer.getData('key')
    if (key) {
      const note = Object.assign(
        {},
        this.props.getNote(key)
          ? this.props.getNote(key)
          : this.findInArchive(key),
      )
      note.folder.name = targetFolder.name

      if (targetFolder.type === 'archive' || note.folder.type === 'archive') {
        this.props.updateArchive(note)
      }

      switch (targetFolder.type) {
        case 'all':
          note.folder.type = targetFolder.type
          break
        case 'archive':
          note.folder.type = targetFolder.type
          break
        default:
          note.folder.type = 'normal'
      }

      this.props.updateAndSave(note)
    }
  }

  archive = e => {
    if (e.dataTransfer.getData('folder')) {
      const target = JSON.parse(e.dataTransfer.getData('folder'))
      this.props.removeFolder(target)
    } else if (e.dataTransfer.getData('key')) {
      const key = e.dataTransfer.getData('key')
      const note = Object.assign({}, this.props.getNote(key))
      this.props.updateArchive(note)
    }
  }

  setOpen = () => {
    this.setState({ searchOpen: true })
  }

  closeSearch = () => {
    this.setState({ searchOpen: false })
  }

  render() {
    const folds = this.props.getFolders()

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
              {Object.values(folds).map(
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
                        folderDraggable={true}
                        onDragStart={this.onFolderDragStart}
                        onDragOver={this.onDragOver}
                        onDrop={this.onDrop}
                        onChangeText={this.updateFolder}
                        onSubmitEditing={() => {
                          this.props.updateFolders(
                            this.state.newFolder,
                            folderDataFromNote.folder,
                          )
                          this.props.setActiveFolder({
                            name: this.state.newFolder,
                            type: 'normal',
                          })
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
                archive={this.archive}
                handleClick={() =>
                  this.props.setActiveFolder({
                    name: 'archive',
                    type: 'archive',
                  })
                }
                handleDoubleClick={this.handleDoubleClick}
              />
            </View>
            <SideBarButtonContainer>
              <Button
                onPress={this.addFolder}
                Icon={PlusSymbolSm}
                variant="grayIcon"
              />
            </SideBarButtonContainer>
          </SidebarContainer>
        )}
        <SidebarContainer showFolders={this.props.showFolders}>
          <MarginTop>
            <NewButtonContainer>
              {!this.state.searchOpen && (
                <Button
                  onPress={this.props.toggleFoldersVisibility}
                  Icon={() => (
                    <Image
                      source={require('./img/folder-gray.svg')}
                      style={{ width: 14, height: 12 }}
                    />
                  )}
                  variant={['grayIcon', 'grayIconSize']}
                />
              )}
              <SearchBar
                data={this.props.notes}
                setOpen={this.setOpen}
                closeSearch={this.closeSearch}
                open={this.state.searchOpen}
              />
              {!this.state.searchOpen && (
                <Button
                  onPress={() =>
                    this.props.update({
                      key: uuidv4(),
                      date: new Date().getTime(),
                      folder: { name: '', type: 'empty' },
                    })
                  }
                  variant={['darkYellow']}
                  Icon={PlusSymbolSm}
                  title="NEW NOTE"
                />
              )}
            </NewButtonContainer>
          </MarginTop>
          {Object.values(folds).map((subArray: Array<Note>, index: number) => {
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
          })}
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
