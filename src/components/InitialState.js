// @flow

import React, { Component } from 'react'
import styled from 'styled-components/native'
import uuidv4 from 'uuid/v4'
import screenSize from '../hocs/ScreenSize'
import applyContext from '../hocs/Context'
import { type Note } from '../types'

type Props = {
  setInitialFalse: () => void,
  update: Note => void,
}

const Container = screenSize(styled.View`
  flex: 1;
  background-color: ${props => props.theme.gray};
  padding: ${props => props.theme.spacing};
`)

const TextContainer = styled.View`
  margin: 100px;
  max-width: 30%;
`

const TitleText = styled.Text`
  font-size: 70px;
`
const Subtitle = styled.Text`
  font-size: 30px;
  margin: 30px 0;
`

const NewButton = styled.Button`
  flex: 1;
`

class InitialState extends Component<Props> {
  render() {
    return (
      <Container>
        <TextContainer>
          <TitleText>{'Welcome to Noted'}</TitleText>
          <Subtitle>
            {
              'All of your important thoughts and ideas, stored securely all over the place.'
            }
          </Subtitle>
          <NewButton
            onPress={() => {
              this.props.setInitialFalse()
              this.props.update({
                key: uuidv4(),
                title: 'untitled',
                date: new Date().getTime(),
              })
            }}
            title="Add new note"
          />
        </TextContainer>
      </Container>
    )
  }
}

export default applyContext(InitialState)
