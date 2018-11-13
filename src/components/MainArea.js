// @flow

import React, { Component } from 'react'
import styled from 'styled-components/native'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState, ContentState, convertFromHTML } from 'draft-js'

import applyContext from '../hocs/Context'

import screenSize from '../hocs/ScreenSize'

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

class MainArea extends Component<{}> {
  constructor(props) {
    super(props)
    this.state = {
      text: 'Notes Title',
    }
  }

  render() {
    return (
      <Container>
        <Title
          value={this.props.note.title}
          onChangeText={text => this.setState({ text })}
        />
        <EditorContainer>
          <Editor
            editorState={EditorState.createWithContent(
              ContentState.createFromBlockArray(
                convertFromHTML(this.props.note.content),
              ),
            )}
            onContentStateChange={newContent =>
              this.props.update({
                ...this.props.note,
                content: newContent.blocks[0].text,
              })
            }
          />
        </EditorContainer>
      </Container>
    )
  }
}

export default applyContext(MainArea)
