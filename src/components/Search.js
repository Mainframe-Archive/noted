// @flow

import React, { Component } from 'react'
import styled from 'styled-components/native'
import _ from 'lodash'
import { Button, TextField } from '@morpheus-ui/core'
import { SearchSm } from '@morpheus-ui/icons'

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
  open: boolean,
  closeSearch: () => void,
  setOpen: () => void,
}

const Container = screenSize(styled.View`
  margin-top: 1px;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.lightGray};
`)

class SearchBar extends Component<Props, State> {
  state = {
    query: '',
    results: [],
  }

  handleInputChange = text => {
    if (text && text.length > 1) {
      this.props.notes.map(note => {
        const escapedString = text
          .toLowerCase()
          .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const regex = new RegExp(escapedString + 'w*', 'g')
        const result = note.title ? note.title.toLowerCase().match(regex) : null
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
        {this.props.open ? (
          <TextField
            placeholder="Search Title"
            onChange={this.handleInputChange}
            IconLeft={SearchSm}
            onPressIcon={this.props.closeSearch}
          />
        ) : (
          <Button
            Icon={SearchSm}
            variant={['grayIcon']}
            onPress={this.props.setOpen}
          />
        )}
        {this.props.open && (
          <Suggestions
            results={this.state.results}
            update={this.props.update}
          />
        )}
      </Container>
    )
  }
}

export default applyContext(SearchBar)
