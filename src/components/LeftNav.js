// @flow

import React, { Component } from 'react'
import styled, { css } from 'styled-components/native'

import applyContext from '../hocs/Context'
import screenSize from '../hocs/ScreenSize'

import SearchBar from './Search'

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

const TitleText = styled.Text`
  font-size: 18px;
  color: ${props => props.theme.white};
  margin-bottom: 20px;
`

const Text = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.white};
  margin-left: 10px;
  margin-bottom: 5px;
  cursor: pointer;
`

const List = styled.FlatList`
  width: 800px;
`

const SearchContainer = styled.View`
  display: flex;
  align-items: center;
`

const NewButton = styled.Button`
  flex: 1;
`

class LeftNav extends Component<{}> {
  render() {
    return (
      <Container>
        <SearchContainer>
          <SearchBar data={this.props.notes} />
        </SearchContainer>
        <TitleText>Your Notes</TitleText>
        <List
          data={this.props.notes}
          renderItem={({ item }) => (
            <Text onClick={() => this.props.update(item)}>{item.title}</Text>
          )}
        />
        <NewButton onPress={this.props.new} title="Add new note" />
      </Container>
    )
  }
}

export default applyContext(LeftNav)
