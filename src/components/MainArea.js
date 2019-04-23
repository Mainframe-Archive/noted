// @flow

import React, { Component } from 'react'
import styled, { css } from 'styled-components/native'
import { Button, Text, TextField } from '@morpheus-ui/core'
import { CheckSymbol } from '@morpheus-ui/icons'
import '@morpheus-ui/fonts'
import { Editor } from 'react-draft-wysiwyg'
import {
  EditorState,
  ContentState,
  convertFromRaw,
  convertToRaw,
} from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import '../css/wysiwyg.css'
import _ from 'lodash'
import { type Note } from '../types'

import applyContext from '../hocs/Context'

type State = {
  autosaved: boolean,
  autosavedTime: number,
  dirty: boolean,
  editorState: EditorState,
  showText: boolean,
}

type Props = {
  backupResult: string,
  note: Note,
  notes: Array<Note>,
  initial: boolean,
  update: (note: Note) => void,
  save: () => void,
  delete: () => void,
  showFolders: boolean,
}

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.white};
  padding: 0 ${props => props.theme.spacing};
`

const TitleContainer = styled.View`
  max-width: 550px;
  width: 100%;
  height: 75px;
  margin-top: 18px;
  ${props =>
    props.showfolders &&
    css`
      max-width: 400px;
    `};
`

const EditorContainer = styled.View`
  padding-bottom: ${props => props.theme.spacing};
  background-color: ${props => props.theme.white};
  max-height: 100vh;
`

const ButtonTitleContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 75px;
`

const ContentContainer = styled.View``

const ButtonContainer = styled.View`
  width: 120px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const CheckContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
`

function formattedTime(timestamp) {
  const time = new Date(timestamp).toLocaleTimeString(undefined, {
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  })
  return time
}

class MainArea extends Component<Props, State> {
  interval: IntervalID

  state: State = {
    autosaved: false,
    autosavedTime: 0,
    dirty: false,
    editorState: EditorState.createWithContent(
      this.props.note.content
        ? convertFromRaw(JSON.parse(this.props.note.content))
        : ContentState.createFromText('Start typing...'),
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
        this.setState({ autosaved: true, autosavedTime: new Date().getTime() })
        this.props.save()
      }
    }, 10000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
    this.setState({ autosaved: false, dirty: false })
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
    return (
      <Container>
        <EditorContainer>
          <ButtonTitleContainer>
            <TitleContainer showfolders={this.props.showFolders}>
              <TextField
                onChange={this.onTitleChange}
                variant="large"
                value={
                  this.props.note.title
                    ? this.props.note.title
                    : this.state.dirty
                    ? ''
                    : 'Title...'
                }
              />
            </TitleContainer>
            {this.props.note.folder.type !== 'archive' && (
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
          <ContentContainer>
            <Editor
              editorState={this.state.editorState}
              onEditorStateChange={this.onEditorChange}
              onContentStateChange={this.onContentChange}
              editorStyle={{ fontFamily: 'Muli', fontSize: 15 }}
              editorClassName={
                this.props.backupResult === '' ? 'editor' : 'banner-editor'
              }
            />
          </ContentContainer>
          <CheckContainer>
            {this.state.showText && this.state.autosaved && (
              <Text variant="faded">
                {'auto saved at: ' + formattedTime(this.state.autosavedTime)}
              </Text>
            )}
            {this.state.autosaved && (
              <Button
                Icon={CheckSymbol}
                variant={['icon', !this.state.autosaved ? 'invisible' : '']}
                onMouseEnter={this.showAutosaved}
              />
            )}
          </CheckContainer>
        </EditorContainer>
      </Container>
    )
  }
}

export default applyContext(MainArea)
