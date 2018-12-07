// @flow

import React, { Component } from 'react'
import styled from 'styled-components/native'
import { Button, TextField } from '@morpheus-ui/core'
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
  background-color: ${props => props.theme.gray};
  padding: ${props => props.theme.spacing};
`)

const EditorContainer = styled.View`
  padding-bottom: ${props => props.theme.spacing};
  background-color: ${props => props.theme.white};
  flex: 1;
`

const ButtonContainer = styled.View`
  max-width: 130px;
  margin-top: 15;
  flex-direction: row;
  justify-content: space-between;
`

class MainArea extends Component<Props, State> {
  state: State = {
    editorState: EditorState.createWithContent(
      this.props.note.content
        ? convertFromRaw(JSON.parse(this.props.note.content))
        : ContentState.createFromText('start typing...'),
    ),
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
    return (
      <Container>
        <TextField
          name="title"
          label="Note Title"
          placeholder="untitled"
          value={this.props.note.title}
          onChangeText={this.onTitleChange}
        />
        <EditorContainer>
          <Editor
            editorState={this.state.editorState}
            onEditorStateChange={this.onEditorChange}
            onContentStateChange={this.onContentChange}
          />
        </EditorContainer>
        <ButtonContainer>
          <Button 
            onPress={this.props.save} 
            title="Save" 
            titleColor="white" 
            backgroundColor="#DA1157" 
            borderColor="#DA1157" 
            borderHoverColor="#DA1157"
            backgroundHoverColor="white"/>
          <Button onPress={this.props.delete} title="Delete" />
        </ButtonContainer>
      </Container>
    )
  }
}

export default applyContext(MainArea)
