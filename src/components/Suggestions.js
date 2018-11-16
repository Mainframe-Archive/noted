import React, { Component } from 'react'
import { FlatList } from 'react-native-web'
import styled from 'styled-components/native'

const SuggestionText = styled.Text`
  color: ${props => props.theme.blue};
  font-size: 14px;
  padding: 5px;
  cursor: pointer;
`

const Container = styled.View`
  background-color: #fff;
  border-radius: 5px;
  opacity: 0.7;
`

export default class Suggestions extends Component<> {
  render() {
    return (
      <Container>
        <FlatList
          data={this.props.results}
          renderItem={({ item }) => {
            console.log('hi')
            return (
              <SuggestionText onClick={() => this.props.update(item)}>
                {item.title}
              </SuggestionText>
            )
          }}
        />
      </Container>
    )
  }
}
