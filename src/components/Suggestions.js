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
  position: relative;
  margin-top: -20px;
  width: 194px;
  padding: 0 5px;
  background-color: ${props => props.theme.white};
  opacity: 1;
  border-radius: 3px;
  z-index: 1000;
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
