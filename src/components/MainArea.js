// @flow

import React, { Component } from 'react'
import styled from 'styled-components/native'
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

const Title = styled.TextInput`
  font-size: 40px;
  padding-bottom: ${props => props.theme.spacing};
  color: ${props => props.theme.darkGray};
`

const ButtonContainer = styled.View`
  max-width: 130px;
  margin-bottom: 30px;
  flex-direction: row;
  justify-content: space-between;
`

const SaveButton = styled.Button`
  flex: 1;
`

const DeleteButton = styled.Button`
  flex: 1;
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
        <Title
          value={this.props.note.title ? this.props.note.title : 'untitled'}
          onChangeText={this.onTitleChange}
        />
        <ButtonContainer>
          <SaveButton onPress={this.props.save} title="Save" />
          <DeleteButton onPress={this.props.delete} title="Delete" />
        </ButtonContainer>
        <EditorContainer>
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
