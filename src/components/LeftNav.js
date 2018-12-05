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
  update: Note => void,
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

const EditableText = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.white};
  margin-left: 10px;
  margin-bottom: 5px;
  cursor: pointer;
  display: block;
`

const FolderContainer = styled.View`
  display: inline;
`

const CollapseFolder = styled.Text`
  color: ${props => props.theme.white};
  font-weight: bold;
  cursor: pointer;
`

const FolderText = styled.TextInput`
  font-size: 15px;
  color: ${props => props.theme.white};
  margin-bottom: 5px;
  margin-top: 10px;
  cursor: pointer;
`

const FolderFlatList = styled.FlatList`
  display: block;
  ${props =>
    props.open !== -1 &&
    css`
      display: none;
    `}
`

const SearchContainer = styled.View`
  display: flex;
  align-items: center;
`

const NewButton = styled.Button`
  flex: 1;
  margin-bottom: 100px;
`

class LeftNav extends Component<Props> {
  constructor(props) {
    super(props)
    this.count = 0
  }

  state = {
    edit: '',
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
    if (item) {
      this.props.update(item)
    }

    this.count++
    this.timeout = setTimeout(() => {
      if (this.count === 2) {
        this.setState({
          edit: item ? item.key : true,
        })
      } else {
      }
      this.count = 0
    }, 250)
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
    const note = Object.assign({}, this.props.getNote(key))
    note.folder = folder
    this.props.update(note, true)
  }

  render() {
    const notes = Object.values(this.props.notes).flat()
    return (
      <Container>
        <SearchContainer>
          <SearchBar data={this.props.notes} />
          <NewButton
            onPress={() =>
              this.props.update({
                key: uuidv4(),
                title: 'untitled',
                date: new Date().getTime(),
              })
            }
            title="Add new note"
          />
        </SearchContainer>
        <TitleText>Your Notes</TitleText>
        <NewButton title="Add a new folder" onPress={this.addFolder} />
        {Object.values(this.props.getFolders()).map((subArray, index) => {
          return (
            <View key={subArray[0].key}>
              <Folder
                data={subArray}
                openFolder={this.openFolder}
                folderID={subArray[0].key}
                folderName={subArray[0].folder}
                edit={!!this.state.edit}
                open={this.state.open.indexOf(subArray[0].key)}
                dragStart={this.onDragStart}
                handleClick={this.handleClick}
              />
            </View>
          )
        })}
        <Folder
          data={notes}
          openFolder={this.openFolder}
          folderName={'all notes'}
          folderID={6520250516}
          edit={false}
          open={this.state.open.indexOf(6520250516)}
          dragStart={this.onDragStart}
          handleClick={this.handleClick}
        />
        <Folder
          data={[]}
          openFolder={this.openFolder}
          folderName={'archive'}
          folderID={65202505614}
          edit={false}
          open={this.state.open.indexOf(65202505614)}
          dragStart={this.onDragStart}
          handleClick={this.handleClick}
        />
      </Container>
    )
  }
}

export default applyContext(LeftNav)
