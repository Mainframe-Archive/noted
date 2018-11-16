import React, { Component } from 'react'
import { FlatList, Text } from 'react-native-web'
import styled from 'styled-components/native'

const SuggestionText = styled.Text`
  background-color: #fff;
  color: ${props => props.theme.blue};
  border-radius: 5px;
  font-size: 14px;
  padding: 5px;
  cursor: pointer;
`

const Suggestions = props => {
  return (
    <FlatList
      data={props.results}
      renderItem={({ item }) => (
        <SuggestionText onClick={() => props.update(item)}>
          {item.title}
        </SuggestionText>
      )}
    />
  )
}

export default Suggestions
