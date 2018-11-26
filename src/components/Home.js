// @flow

import React, { Component } from 'react'
import styled from 'styled-components/native'

import LeftNav from './LeftNav'
import MainArea from './MainArea'
import InitialState from './InitialState'

const Root = styled.View`
  width: 100vw;
  height: 100vh;
  flex: 1;
  flex-direction: row;
`
class Home extends Component<{}> {
  state = {
    initial: true,
  }

  componentDidMount() {
    if (localStorage.getItem('local-storage-session-key')) {
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
