import React from 'react'
import { FlatList } from 'react-native-web'
import styled from 'styled-components/native'

const SuggestionText = styled.Text`
  color: ${props => props.theme.darkGray};
  font-size: 14px;
  padding: 5px;
  cursor: pointer;
`

const Container = styled.View`
  background-color: ${props => props.theme.white};
  border-radius: 5px;
`

const Suggestions = props => {
  return (
    <Container>
      <FlatList
        data={props.results}
        renderItem={({ item }) => (
          <SuggestionText onClick={() => props.update(item)}>
            {item.title}
          </SuggestionText>
        )}
      />
    </Container>
  )
}

export default Suggestions
