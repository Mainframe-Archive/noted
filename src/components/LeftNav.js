// @flow

import React, { Component } from 'react'
import styled, { css } from 'styled-components/native'
import { View } from 'react-native-web'
import uuidv4 from 'uuid/v4'
import { type Note } from '../types'
import applyContext from '../hocs/Context'
import screenSize from '../hocs/ScreenSize'

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
        {/*!this.props.initial && (
          <View>
            <TitleText>Your Recent Notes</TitleText>
            <FlatList
              data={
                this.props.notes.length < 5
                  ? this.props.notes
                      .sort((a, b) => {
                        return b.date - a.date
                      })
                      .slice(0, this.props.notes.length)
                  : this.props.notes
                      .sort((a, b) => {
                        return b.date - a.date
                      })
                      .slice(0, 5)
              }
              renderItem={({ item }) =>
                item.invisible !== true && (
                  <EditableText
                    key={item.key}
                    onClick={() => this.handleClick(item)}>
                    {item.title}
                  </EditableText>
                )
              }
            />
          </View>
        )*/}
        <TitleText>Your Notes</TitleText>
        <NewButton title="Add a new folder" onPress={this.addFolder} />
        {Object.values(this.props.getFolders()).map((subArray, index) => {
          return (
            <View key={subArray[0] ? subArray[0].key + index : index}>
              <FolderContainer>
                <CollapseFolder
                  onClick={() =>
                    this.openFolder(subArray[0] && subArray[0].key + index)
                  }>
                  {subArray[0] &&
                    (this.state.open.indexOf(subArray[0].key + index) === -1
                      ? 'v '
                      : '> ')}
                </CollapseFolder>
                <FolderText
                  editable={!!this.state.edit}
                  onClick={() => this.handleClick()}
                  onDragOver={e => this.onDragOver(e)}
                  onDrop={e =>
                    this.onDrop(
                      e,
                      subArray[0] ? subArray[0].folder : this.state.addFolder,
                    )
                  }
                  onChangeText={text => this.updateFolder(text)}
                  onSubmitEditing={() => {
                    subArray[0] &&
                      this.props.updateFolders(
                        this.state.newFolder,
                        subArray[0].folder,
                      )
                    this.setState({ edit: '' })
                  }}
                  defaultValue={subArray[0] && subArray[0].folder}
                />
                <FolderFlatList
                  open={
                    subArray[0] &&
                    this.state.open.indexOf(subArray[0].key + index)
                  }
                  data={subArray}
                  renderItem={({ item }) => {
                    return (
                      item.invisible !== true && (
                        <EditableText
                          draggable
                          onDragStart={e => this.onDragStart(e, item.key)}
                          onClick={() => this.handleClick(item)}>
                          {item.title}
                        </EditableText>
                      )
                    )
                  }}
                />
              </FolderContainer>
            </View>
          )
        })}
        <FolderContainer>
          <CollapseFolder onClick={() => this.openFolder('all notes')}>
            {this.state.open.indexOf('all notes') === -1 ? 'v ' : '> '}
          </CollapseFolder>
          <FolderText editable={false} defaultValue={'all notes'} />
          <FolderFlatList
            open={this.state.open.indexOf('all notes')}
            data={notes}
            renderItem={({ item }) => {
              return (
                item.invisible !== true && (
                  <EditableText
                    draggable
                    onDragStart={e => this.onDragStart(e, item.key)}
                    onClick={() => this.handleClick(item)}>
                    {item.title}
                  </EditableText>
                )
              )
            }}
          />
        </FolderContainer>
      </Container>
    )
  }
}

export default applyContext(LeftNav)
