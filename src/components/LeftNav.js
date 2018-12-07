// @flow

import React, { Component } from 'react'
import styled, { css } from 'styled-components/native'
import { Button } from '@morpheus-ui/core'
import { FlatList } from 'react-native-web'
import uuidv4 from 'uuid/v4'
import { type Note } from '../types'

import applyContext from '../hocs/Context'
import screenSize from '../hocs/ScreenSize'

import SearchBar from './Search'

type Props = {
  notes: Array<Note>,
  update: Note => void,
}

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

class LeftNav extends Component<Props> {
  render() {
    return (
      <Container>
        <SearchContainer>
          <SearchBar data={this.props.notes || null} />
        </SearchContainer>
        <TitleText>Your Recent Notes</TitleText>
        <FlatList
          data={
            this.props.notes.length < 5
              ? this.props.notes
                  .sort((a, b) => {
                    return b.date - a.date
                  })
                  .slice(0, this.props.notes.length)
              : this.props.notes
                  .sort((a, b) => {
                    return b.date - a.date
                  })
                  .slice(0, 5)
          }
          renderItem={({ item }) => (
            <Text onClick={() => this.props.update(item)}>{item.title}</Text>
          )}
        />
        <TitleText>Your Notes</TitleText>
        <FlatList
          data={this.props.notes.reverse()}
          renderItem={({ item }) => (
            <Text onClick={() => this.props.update(item)}>{item.title}</Text>
          )}
        />
        <Button
          onPress={() =>
            this.props.update({
              key: uuidv4(),
              date: new Date().getTime(),
            })
          }
          title="Add new note"
          borderColor="#00A7E7"
          borderHoverColor="#00A7E7"
          backgroundColor="#00A7E7"
          backgroundHoverColor="white"
          titleColor="white"
          titleHoverColor="#00A7E7"
        />
      </Container>
    )
  }
}

export default applyContext(LeftNav)
