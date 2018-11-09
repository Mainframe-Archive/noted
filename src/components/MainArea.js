// @flow

import React, { Component } from 'react'
import styled, { css } from 'styled-components/native'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

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

const Title = styled.Text`
  font-size: 40px;
  padding-bottom: ${props => props.theme.spacing};
  color: ${props => props.theme.darkGray};
`

export default class MainArea extends Component<{}> {
  render() {
    return (
      <Container>
        <Title>Note Title</Title>
        <EditorContainer>
          <Editor />
        </EditorContainer>
      </Container>
    )
  }
}
