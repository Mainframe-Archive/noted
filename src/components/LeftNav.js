// @flow

import React, { Component } from 'react'
import styled, { css } from 'styled-components/native'
import { FlatList } from 'react-native-web'
import uuidv4 from 'uuid/v4'

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
        <TitleText>Your Recent Notes</TitleText>
        <FlatList
          data={this.props.notes
            .sort((a, b) => {
              return a.date - b.date
            })
            .slice(this.props.notes.length - 5, this.props.notes.length)}
          renderItem={({ item }) => (
            <Text onClick={() => this.props.update(item)}>{item.title}</Text>
          )}
        />
        <TitleText>Your Notes</TitleText>
        <FlatList
          data={this.props.notes}
          renderItem={({ item }) => (
            <Text onClick={() => this.props.update(item)}>{item.title}</Text>
          )}
        />
        <NewButton
          onPress={() =>
            this.props.update({
              key: uuidv4(),
              title: 'untitled',
              content: 'start typing...',
              date: `${new Date().getTime()}`,
            })
          }
          title="Add new note"
        />
      </Container>
    )
  }
}

export default applyContext(LeftNav)
