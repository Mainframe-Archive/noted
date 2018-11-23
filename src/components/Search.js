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

const Search = styled.TextInput`
  background-color: #fff;
  flex: 1;
  font-size: 12px;
  border-radius: 4px;
  padding: 5px 10px;
  outline-width: 0;
`

class SearchBar extends Component<Props, State> {
  state = {
    query: '',
    results: [],
  }

  handleInputChange = text => {
    const nextState = { query: text }
    // this.setState({ query: text })

    if (this.state.query && this.state.query.length > 1) {
      if (this.state.query.length % 2 === 0) {
        this.props.notes.map(note => {
          const escapedString = this.state.query.replace(
            /[.*+?^${}()|[\]\\]/g,
            '\\$&',
          )
          const regex = new RegExp(escapedString + 'w*', 'g')
          const result = note.title.match(regex)
          if (result) {
            const copy = this.state.results.slice()
            const index = _.findIndex(copy, { title: note.title })
            nextState.results = index === -1 ? copy.concat(note) : copy
          }
          return this.state.results
        })
      }
    }
    this.setState(nextState)
  }

  render() {
    return (
      <Container>
        <Search
          placeholder="Search Title"
          onChangeText={this.handleInputChange}
          value={this.state.query}
        />
        <Suggestions results={this.state.results} update={this.props.update} />
      </Container>
    )
  }
}

export default applyContext(SearchBar)
