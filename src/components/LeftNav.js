// @flow

import React, { Component } from 'react'
import styled, { css } from 'styled-components/native'
import { View } from 'react-native-web'
import uuidv4 from 'uuid/v4'
import { type Note } from '../types'
import applyContext from '../hocs/Context'
import screenSize from '../hocs/ScreenSize'
import Folder from './Folder'
import Notes from './Notes'
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
  open: string,
}

const Container = screenSize(styled.View`
  width: 500px;
  height: 100%;
  background-color: #f9f9f9;
  padding: ${props => props.theme.spacing};
  display: flex;
  flex-direction: row;
  ${props =>
    props.screenWidth <= 900 &&
    css`
      width: 50px;
    `};
`)

const SidebarContainer = screenSize(styled.View`
  width: 200px;
  background-color: #f9f9f9;
  padding: ${props => props.theme.spacing};
  ${props =>
    props.screenWidth <= 900 &&
    css`
      width: 50px;
    `};
`)

const TitleText = styled.Text`
  font-size: 18px;
  color: ${props => props.theme.black};
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
    open: '',
  }

  addFolder = () => {
    this.props.update({ key: uuidv4(), invisible: true, folder: 'new folder' })
  }

  handleClick = item => {
    if (item) {
      this.props.update(item)
    }
  }

  folderClick = folderId => {
    if (folderId) {
      this.setState({
        open: folderId,
      })
    } else {
      this.count++
      this.timeout = setTimeout(() => {
        if (this.count === 2) {
          this.setState({
            edit: true,
          })
        }
        this.count = 0
      }, 250)
    }
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
    console.log(this.state.open)
    return (
      <Container>
        <SidebarContainer>
          <NewButton title="Add a new folder" onPress={this.addFolder} />
          <SearchContainer>
            <SearchBar data={this.props.notes} />
          </SearchContainer>
          {Object.values(this.props.getFolders()).map(
            (subArray: Array<Note>, index: number) => {
              return (
                <View key={subArray[0].key}>
                  <Folder
                    openFolder={this.openFolder}
                    folderID={subArray[0].key}
                    folderName={subArray[0].folder && subArray[0].folder}
                    onDragOver={this.onDragOver}
                    onDrop={this.onDrop}
                    onChangeText={this.updateFolder}
                    onSubmitEditing={() => {
                      subArray[0].folder &&
                        this.props.updateFolders(
                          this.state.newFolder,
                          subArray[0].folder,
                        )
                      this.setState({ edit: false })
                    }}
                    edit={this.state.edit}
                    open={this.state.open === subArray[0].key}
                    handleClick={this.folderClick}
                  />
                </View>
              )
            },
          )}
          <Folder
            openFolder={this.openFolder}
            folderName={'all notes'}
            folderID={'all notes'}
            edit={false}
            open={this.state.open === 'all notes'}
            handleClick={this.folderClick}
          />
          <Folder
            openFolder={this.openFolder}
            folderName={'archive'}
            folderID={'archive'}
            edit={false}
            open={this.state.open === 'archive'}
            onDragOver={this.onDragOver}
            archive={this.archiveNote}
            handleClick={this.folderClick}
          />
        </SidebarContainer>
        <SidebarContainer>
          <TitleText>Your Notes</TitleText>
          <NewButton
            onPress={() =>
              this.props.update({
                key: uuidv4(),
                date: new Date().getTime(),
                folder: '',
              })
            }
            title="Add new note"
          />
          {Object.values(this.props.getFolders()).map(
            (subArray: Array<Note>, index: number) => {
              return (
                <View key={subArray[0].key}>
                  <Notes
                    data={subArray}
                    folderID={subArray[0].key}
                    folderName={subArray[0].folder && subArray[0].folder}
                    open={this.state.open === subArray[0].key}
                    dragStart={this.onDragStart}
                    handleClick={this.handleClick}
                  />
                </View>
              )
            },
          )}
          <Notes
            data={this.props.notes}
            folderID={'all notes'}
            folderName={'all notes'}
            open={this.state.open === 'all notes'}
            dragStart={this.onDragStart}
            handleClick={this.handleClick}
          />
          <Notes
            data={this.props.archive}
            folderName={'archive'}
            folderID={'archive'}
            open={this.state.open === 'archive'}
            dragStart={this.onDragStart}
            handleClick={this.handleClick}
          />
        </SidebarContainer>
      </Container>
    )
  }
}

export default applyContext(LeftNav)
