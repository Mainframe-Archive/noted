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
`

class SearchBar extends Component<Props, State> {
  state = {
    query: '',
    results: [],
  }

  handleInputChange = text => {
    if (text && text.length > 1) {
      if (text.length % 2 === 0) {
        this.props.notes.map(note => {
          const escapedString = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          const regex = new RegExp(escapedString + 'w*', 'g')
          const result = note.title.match(regex)
          if (result) {
            const copy = this.state.results.slice()
            const index = _.findIndex(copy, { title: note.title })
            this.setState(state => {
              return {
                query: text,
                results:
                  index === -1 ? state.results.concat(note) : state.results,
              }
            })
          }
          return this.state.results
        })
      }
    }
  }

  onBlur = () => {
    this.setState({ results: [] })
  }

  render() {
    return (
      <Container>
        <Search
          placeholder="Search Title"
          onChangeText={this.handleInputChange}
          onBlur={this.onBlur}
        />
        <Suggestions results={this.state.results} update={this.props.update} />
      </Container>
    )
  }
}

export default applyContext(SearchBar)
