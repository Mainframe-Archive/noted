// @flow

import React, { Component } from 'react'
import styled from 'styled-components/native'
import { Button, Text, TextField } from '@morpheus-ui/core'
import { CheckSymbol } from '@morpheus-ui/icons'
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
import { formattedTime } from './Notes'

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
`)

const EditorContainer = styled.View`
  padding-bottom: ${props => props.theme.spacing};
  background-color: ${props => props.theme.white};
  max-height: 100vh;
  overflow-y: auto;
  flex: 1;
`

const ButtonContainer = styled.View`
  padding-top: 6px;
  width: 120px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`

const CheckContainer = styled.View`
  display: flex;
  align-items: flex-end;
`

class MainArea extends Component<Props, State> {
  interval: IntervalID

  state: State = {
    autosaved: false,
    dirty: false,
    editorState: EditorState.createWithContent(
      this.props.note.content
        ? convertFromRaw(JSON.parse(this.props.note.content))
        : ContentState.createFromText('start typing...'),
    ),
    showText: false,
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
    this.setState({ dirty: true })
    this.props.update({ ...this.props.note, title: newTitle })
  }

  showAutosaved = () => {
    this.setState({ showText: true }, this.hideAutosaved())
  }

  hideAutosaved = () => {
    setTimeout(() => this.setState({ showText: false }), 3000)
  }

  render() {
    const d = new Date()
    return (
      <Container>
        <EditorContainer>
          <ButtonTitleContainer>
            <TextField
              onChange={this.onTitleChange}
              variant="large"
              value={
                this.props.note.title
                  ? this.props.note.title
                  : this.state.dirty
                  ? ''
                  : 'untitled'
              }
            />
            {this.props.note.folder !== 'archive' && (
              <ButtonContainer>
                <Button
                  onPress={this.props.delete}
                  title="DELETE"
                  variant={['borderless', 'short']}
                />
                <Button
                  onPress={this.props.save}
                  title="SAVE"
                  variant={['darkYellow', 'short']}
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
        <CheckContainer>
          {this.state.autosaved && (
            <Button
              Icon={CheckSymbol}
              variant={['icon']}
              onMouseEnter={this.showAutosaved}
            />
          )}
          {this.state.showText && (
            <Text variant="faded">{'auto saved at: ' + formattedTime(d)}</Text>
          )}
        </CheckContainer>
      </Container>
    )
  }
}

export default applyContext(MainArea)
