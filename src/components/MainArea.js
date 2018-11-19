// @flow

import React, { Component } from 'react'
import styled from 'styled-components/native'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, ContentState, convertFromHTML } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import { type Note } from '../types'

import applyContext from '../hocs/Context'

import screenSize from '../hocs/ScreenSize'

type State = {
  title: string,
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
    title: this.props.note.title,
    editorState: EditorState.createWithContent(
      ContentState.createFromBlockArray(
        convertFromHTML(this.props.note.content),
      ),
    ),
  }

  onContentChange = newContent => {
    this.props.update({
      ...this.props.note,
      content: newContent.blocks[0].text,
    })
  }

  onTitleChange = newTitle => {
    this.props.update({ ...this.props.note, title: newTitle })
  }

  render() {
    return (
      <Container>
        <Title
          value={this.props.note.title}
          onChangeText={text => {
            this.onTitleChange(text)
          }}
        />
        <ButtonContainer>
          <SaveButton onPress={this.props.save} title="Save" />
          <DeleteButton onPress={this.props.delete} title="Delete" />
        </ButtonContainer>
        <EditorContainer>
          <Editor
            defaultEditorState={this.state.editorState}
            onChange={newContent => this.onContentChange(newContent)}
          />
        </EditorContainer>
      </Container>
    )
  }
}

export default applyContext(MainArea)
