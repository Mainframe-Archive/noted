// @flow

import React, { Component } from 'react'
import styled, { css } from 'styled-components/native'
import { FlatList, View } from 'react-native-web'
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

const EditableText = styled.TextInput`
  font-size: 14px;
  color: ${props => props.theme.white};
  margin-left: 10px;
  margin-bottom: 5px;
  cursor: pointer;
`

const Text = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.white};
  margin-left: 10px;
  margin-bottom: 5px;
  cursor: pointer;
`

const FolderText = styled.Text`
  font-size: 15px;
  color: ${props => props.theme.white};
  margin-bottom: 5px;
  margin-top: 10px;
  cursor: pointer;
`

const SearchContainer = styled.View`
  display: flex;
  align-items: center;
`

const NewButton = styled.Button`
  flex: 1;
`
const TextInput = styled.TextInput`
  background-color: ${props => props.theme.white};
  color: ${props => props.theme.blue};
  padding: 5px;
  margin: 5px;
  border-radius: 5px;
  display: none;
  ${props =>
    props.show &&
    css`
      display: block;
    `}
`

class LeftNav extends Component<Props> {
  constructor(props) {
    super(props)
    this.count = 0
  }

  state = {
    addFolder: '',
    edit: false,
    newTitle: '',
  }

  newFolder = () => {
    this.setState({ addFolder: 'new folder' })
  }

  handleClick = item => {
    this.props.update(item)

    this.count++
    this.timeout = setTimeout(() => {
      if (this.count === 2) {
        this.setState({
          edit: true,
        })
      } else {
      }
      this.count = 0
    }, 250)
  }

  updateText = (text, item) => {
    this.setState({ newTitle: text })
    this.props.update({ ...item, title: text })
  }

  render() {
    const folders = []
    this.props.notes.map(note => {
      if (note.folder !== undefined) {
        if (folders[note.folder]) {
          const all = folders[note.folder]
          folders[note.folder] = [...all, note]
        } else {
          folders[note.folder] = [note]
        }
      } else {
        folders['no-folder'] = [note]
      }
      return folders
    })

    if (this.state.addFolder) {
      folders[this.state.addFolder] = []
    }

    return (
      <Container>
        <SearchContainer>
          <SearchBar data={this.props.notes || null} />
        </SearchContainer>
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
          renderItem={({ item }) => (
            <EditableText
              editable={this.state.edit}
              onClick={() => this.handleClick(item)}
              defaultValue={item.title}
              onChangeText={text => this.updateText(text, item)}
              onSubmitEditing={() => this.props.save(item)}
            />
          )}
        />
        <TitleText>Your Notes</TitleText>
        <NewButton title="Add a new folder" onPress={this.newFolder} />
        {Object.values(folders).map((subArray, index) => {
          return (
            <View key={subArray[0] ? subArray[0].key : index}>
              <FolderText>
                {subArray[0] ? subArray[0].folder : this.state.addFolder}
              </FolderText>
              <FlatList
                data={subArray}
                renderItem={({ item }) => (
                  <EditableText
                    editable={this.state.edit}
                    onClick={() => this.handleClick(item)}
                    defaultValue={item.title}
                    onChangeText={text => this.updateText(text, item)}
                    onSubmitEditing={() => this.props.save(item)}
                  />
                )}
              />
            </View>
          )
        })}
        <NewButton
          onPress={() =>
            this.props.update({
              key: uuidv4(),
              title: 'untitled',
              content: 'start typing...',
              date: new Date().getTime(),
            })
          }
          title="Add new note"
        />
      </Container>
    )
  }
}

export default applyContext(LeftNav)
