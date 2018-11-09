// @flow

import React, { Component } from 'react'
import styled, { css } from 'styled-components/native'

import screenSize from '../hocs/ScreenSize'

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

const Text = styled.Text`
  font-size: 10px;
  color: ${props => props.theme.white};
`

export default class LeftNav extends Component<{}> {
  render() {
    return (
      <Container>
        <Text>Left Navigation</Text>
      </Container>
    )
  }
}
