// @flow

import React, { Component } from 'react'
import styled, { css } from 'styled-components/native'
import _ from 'lodash'

import applyContext from '../hocs/Context'
import screenSize from '../hocs/ScreenSize'

import NOTES from '../notes.json'

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

const List = styled.FlatList`
  width: 800px;
  cursor: pointer;
`

class LeftNav extends Component<{}> {
  state = {
    data: [],
  }

  componentDidMount() {
    this.setState({ data: _.toArray(NOTES) })
  }

  openNote = item => {
    console.log('opening... ' + item.title)
  }

  render() {
    return (
      <Container>
        <Text>Your Notes</Text>
        <List
          data={this.state.data}
          renderItem={({ item }) => (
            <Text onClick={() => this.props.update(item)}>{item.title}</Text>
          )}
        />
      </Container>
    )
  }
}

export default applyContext(LeftNav)
