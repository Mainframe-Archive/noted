// @flow

import React, { Component } from 'react'
import styled, { css } from 'styled-components/native'

import applyContext from '../hocs/Context'
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

const List = styled.FlatList`
  width: 800px;
  cursor: pointer;
`

const ButtonContainer = styled.View`
  max-width: 130px;
  flex-direction: row;
  justify-content: space-between;
`

const NewButton = styled.Button`
  flex: 1;
`

class LeftNav extends Component<{}> {
  render() {
    return (
      <Container>
        <Text>Your Notes</Text>
        <List
          data={this.props.notes}
          renderItem={({ item }) => (
            <Text onClick={() => this.props.update(item)}>{item.title}</Text>
          )}
        />
        <ButtonContainer>
          <NewButton onPress={this.props.new} title="Add new note" />
        </ButtonContainer>
      </Container>
    )
  }
}

export default applyContext(LeftNav)
