// @flow

import React, { Component } from 'react'
import styled from 'styled-components/native'

import LeftNav from './LeftNav'
import MainArea from './MainArea'
import InitialState from './InitialState'

type State = {
  initial: boolean,
}

const Root = styled.View`
  width: 100vw;
  height: 100vh;
  flex: 1;
  flex-direction: row;
`
class Home extends Component<{}, State> {
  state = {
    initial: true,
  }

  componentDidMount() {
    // there will likely be a better/ additional deciding factor here
    // once integrated w/ swarm
    if (localStorage.getItem('notes')) {
      this.setState({ initial: false })
    }
  }

  setInitialFalse = () => {
    this.setState({ initial: false })
  }

  render() {
    return (
      <Root>
        <LeftNav />
        {this.state.initial ? (
          <InitialState setInitialFalse={this.setInitialFalse} />
        ) : (
          <MainArea />
        )}
      </Root>
    )
  }
}

export default Home
