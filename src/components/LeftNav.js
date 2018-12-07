// @flow

import React, { Component } from 'react'
import styled, { css } from 'styled-components/native'
import { View } from 'react-native-web'
import uuidv4 from 'uuid/v4'
import { type Note } from '../types'
import applyContext from '../hocs/Context'
import screenSize from '../hocs/ScreenSize'
import Folder from './Folder'
import SearchBar from './Search'

type Props = {
  notes: Array<Note>,
  update: (Note, ?boolean) => void,
  updateAndSave: (Note, ?boolean) => void,
  archive: Array<Note>,
  updateArchive: Note => void,
  updateFolders: (string, string) => void,
  getFolders: () => Array<Note>,
  getNote: string => Note,
}

type State = {
  edit: boolean,
  newTitle: string,
  addFolder: string,
  newFolder: string,
  open: Array<string>,
}

const Container = screenSize(styled.View`
  width: 300px;
  height: 100%;
  background-color: ${props => props.theme.blue};
  padding: ${props => props.theme.spacing};
  ${props =>
    props.screenWidth <= 900 &&
    css`
      width: 50px;
    `};
`)

const TitleText = styled.Text`
  font-size: 18px;
  color: ${props => props.theme.white};
  margin-bottom: 20px;
`

const SearchContainer = styled.View`
  display: flex;
  align-items: center;
`

const NewButton = styled.Button`
  flex: 1;
  margin-bottom: 100px;
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
    open: [],
  }

  addFolder = () => {
    this.props.update({ key: uuidv4(), invisible: true, folder: 'new folder' })
  }

  openFolder = folder => {
    const copy = this.state.open.slice()
    const index = copy.indexOf(folder)
    index === -1 ? copy.push(folder) : copy.splice(index, 1)
    this.setState({
      open: copy,
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

  onDrop = (e, folder) => {
    const key = e.dataTransfer.getData('key')
    const note = Object.assign(
      {},
      this.props.getNote(key)
        ? this.props.getNote(key)
        : this.findInArchive(key),
    )
    !this.props.getNote(key) && this.props.updateArchive(note)

    note.folder = folder
    this.props.updateAndSave(note)
  }

  archiveNote = e => {
    const key = e.dataTransfer.getData('key')
    const note = Object.assign({}, this.props.getNote(key))
    this.props.updateArchive(note)
  }

  render() {
    return (
      <Container>
        <SearchContainer>
          <SearchBar data={this.props.notes} />
          <NewButton
            onPress={() =>
              this.props.update({
                key: uuidv4(),
                date: new Date().getTime(),
              })
            }
            title="Add new note"
          />
        </SearchContainer>
        <TitleText>Your Notes</TitleText>
        <NewButton title="Add a new folder" onPress={this.addFolder} />
        {Object.values(this.props.getFolders()).map(
          (subArray: Array<Note>, index: number) => {
            const folderDataFromNote = subArray[0]
            return (
              <View key={folderDataFromNote.key}>
                <Folder
                  data={subArray}
                  openFolder={this.openFolder}
                  folderID={folderDataFromNote.key}
                  folderName={folderDataFromNote.folder}
                  onDragOver={this.onDragOver}
                  onDrop={this.onDrop}
                  onChangeText={this.updateFolder}
                  onSubmitEditing={() => {
                    this.props.updateFolders(
                      this.state.newFolder,
                      folderDataFromNote.folder,
                    )
                    this.setState({ edit: false })
                  }}
                  isBeingEdited={this.state.edit}
                  isOpen={
                    this.state.open.indexOf(folderDataFromNote.key) === -1
                      ? false
                      : true
                  }
                  dragStart={this.onDragStart}
                  handleClick={this.handleClick}
                  handleDoubleClick={this.handleDoubleClick}
                />
              </View>
            )
          },
        )}
        <Folder
          data={this.props.notes}
          openFolder={this.openFolder}
          folderName={'all notes'}
          folderID={'all notes'}
          isBeingEdited={false}
          isOpen={this.state.open.indexOf('all notes') === -1 ? false : true}
          dragStart={this.onDragStart}
          handleClick={this.handleClick}
          handleDoubleClick={this.handleDoubleClick}
        />
        <Folder
          data={this.props.archive}
          openFolder={this.openFolder}
          folderName={'archive'}
          folderID={'archive'}
          isBeingEdited={false}
          isOpen={this.state.open.indexOf('archive') === -1 ? false : true}
          onDragOver={this.onDragOver}
          dragStart={this.onDragStart}
          handleClick={this.handleClick}
          handleDoubleClick={this.handleDoubleClick}
          archive={this.archiveNote}
        />
      </Container>
    )
  }
}

export default applyContext(LeftNav)
