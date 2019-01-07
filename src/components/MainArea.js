// @flow

import React, { Component } from 'react'
import styled, { css } from 'styled-components/native'
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
  dirty: boolean,
}

type Props = {
  note: Note,
  notes: Array<Note>,
  initial: boolean,
  update: (note: Note) => void,
  save: () => void,
  delete: () => void,
}

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.white};
  padding: ${props => props.theme.spacing};
`

const ButtonTitleContainer = screenSize(styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  ${props =>
    props.screenWidth <= 1100 &&
    css`
      flex-direction: column;
    `};
`)

const EditorContainer = styled.View`
  padding-bottom: ${props => props.theme.spacing};
  background-color: ${props => props.theme.white};
  max-height: 100vh;
  overflow-y: auto;
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
    dirty: true,
    editorState: EditorState.createWithContent(
      this.props.note.content
        ? convertFromRaw(JSON.parse(this.props.note.content))
        : ContentState.createFromText('start typing...'),
    ),
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      const onlyAutoSaveDirtyNote =
        (this.props.note.content || this.props.note.title) &&
        this.props.note.folder.type !== 'archive' &&
        !this.props.initial

      if (onlyAutoSaveDirtyNote) {
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
    this.setState({dirty: false})
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
              value={this.props.note.title ? this.props.note.title : (this.state.dirty ? 'untitled' : '')}
              onChangeText={this.onTitleChange}
            />
            {this.props.note.folder !== 'archive' && (
              <ButtonContainer>
                <Button
                  onPress={this.props.delete}
                  title="DELETE"
                  variant="borderless"
                />
                <Button
                  onPress={this.props.save}
                  title="SAVE"
                  variant="yellow"
                />
              </ButtonContainer>
            )}
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
