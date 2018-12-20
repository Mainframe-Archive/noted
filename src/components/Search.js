// @flow

import React, { Component } from 'react'
import styled, { css } from 'styled-components/native'
import _ from 'lodash'
import screenSize from '../hocs/ScreenSize'
import applyContext from '../hocs/Context'
import { type Note } from '../types'
import Suggestions from './Suggestions'

type State = {
  query: string,
  results: Array<Note>,
}

type Props = {
  note: Note,
  notes: Array<Note>,
  update: (note: Note) => void,
  save: () => void,
  delete: () => void,
}

const Container = screenSize(styled.View`
  flex: 1;
  height: 100%;
  background-color: ${props => props.theme.lightGray};
  padding: ${props => props.theme.spacing};
  ${props =>
    props.screenWidth <= 900 &&
    css`
      width: 50px;
    `};
`)

const Search = styled.TextInput`
  background-color: ${props => props.theme.white};
  flex: 1;
  font-size: 12px;
  border-radius: 4px;
  padding: 5px 10px;
  border: 1px solid ${props => props.theme.blue};
`

class SearchBar extends Component<Props, State> {
  state = {
    query: '',
    results: [],
  }

  handleInputChange = text => {
    if (text && text.length > 1) {
      this.props.notes.map(note => {
        const escapedString = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const regex = new RegExp(escapedString + 'w*', 'g')
        const result = note.title ? note.title.match(regex) : null
        if (result) {
          const copy = this.state.results.slice()
          const index = _.findIndex(copy, { title: note.title })
          this.setState(prevState => ({
            query: text,
            results:
              index === -1
                ? prevState.results.concat(note)
                : prevState.results.splice(index, 1, note),
          }))
        }
        return this.state.results
      })
    }
  }

  render() {
    return (
      <Container>
        <Search
          placeholder="Search Title"
          onChangeText={this.handleInputChange}
        />
        <Suggestions results={this.state.results} update={this.props.update} />
      </Container>
    )
  }
}

export default applyContext(SearchBar)
