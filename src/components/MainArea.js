// @flow

import React, { Component } from 'react'
import styled from 'styled-components/native'
import { Button } from '@morpheus-ui/core'
import { Editor } from 'react-draft-wysiwyg'
import {
  EditorState,
  ContentState,
  convertFromRaw,
  convertToRaw,
} from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import _ from 'lodash'
import { type Note } from '../types'

import applyContext from '../hocs/Context'

import screenSize from '../hocs/ScreenSize'

type State = {
  editorState: EditorState,
  autosaved: boolean,
}

type Props = {
  note: Note,
  notes: Array<Note>,
  update: (note: Note) => void,
  save: () => void,
  delete: () => void,
}

const Container = screenSize(styled.View`
  flex: 1;
  background-color: ${props => props.theme.white};
  padding: ${props => props.theme.spacing};
`)

const ButtonTitleContainer = screenSize(styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`)

const EditorContainer = styled.View`
  padding-bottom: ${props => props.theme.spacing};
  background-color: ${props => props.theme.white};
  flex: 1;
`

const Title = styled.TextInput`
  font-size: 40px;
  padding-bottom: ${props => props.theme.spacing};
  color: ${props => props.theme.darkGray};
`

const Text = styled.Text`
  font-size: 14px;
`

const ButtonContainer = styled.View`
  width: 130px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

class MainArea extends Component<Props, State> {
  interval: IntervalID

  state: State = {
    autosaved: false,
    editorState: EditorState.createWithContent(
      this.props.note.content
        ? convertFromRaw(JSON.parse(this.props.note.content))
        : ContentState.createFromText('start typing...'),
    ),
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      if (this.props.note.content || this.props.note.title) {
        this.setState({ autosaved: true })
        this.props.save()
      }
    }, 10000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
    this.setState({ autosaved: false })
  }

  onEditorChange = editorState => {
    this.setState({ editorState: editorState })
  }

  onContentChange = _.debounce(e => {
    const contentState = this.state.editorState.getCurrentContent()
    let noteContent = convertToRaw(contentState)
    noteContent = JSON.stringify(noteContent)
    this.props.update({
      ...this.props.note,
      content: noteContent,
    })
  }, 250)

  onTitleChange = newTitle => {
    this.props.update({ ...this.props.note, title: newTitle })
  }

  render() {
    const d = new Date()
    return (
      <Container>
        <Text>
          {this.state.autosaved &&
            'auto saved at: ' +
              d.getHours() +
              ':' +
              d.getMinutes() +
              ':' +
              d.getSeconds()}
        </Text>
        <EditorContainer>
          <ButtonTitleContainer>
            <Title
              value={this.props.note.title ? this.props.note.title : 'untitled'}
              onChangeText={this.onTitleChange}
            />
            <ButtonContainer>
              <Button onPress={this.props.save} title="SAVE" />
              <Button onPress={this.props.delete} title="DELETE" />
            </ButtonContainer>
          </ButtonTitleContainer>
          <Editor
            editorState={this.state.editorState}
            onEditorStateChange={this.onEditorChange}
            onContentStateChange={this.onContentChange}
          />
        </EditorContainer>
      </Container>
    )
  }
}

export default applyContext(MainArea)
