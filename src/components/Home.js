// @flow

import React, { Component } from 'react'
import styled from 'styled-components/native'

import LeftNav from './LeftNav'
import MainArea from './MainArea'
import InitialState from './InitialState'
import applyContext from '../hocs/Context'

type Props = {
  initial: boolean,
  apiVersion: string,
  setInitialFalse: () => void,
}

const Root = styled.View`
  width: 100vw;
  height: 100vh;
  flex: 1;
  flex-direction: row;
`
const SdkVersion = styled.Text`
  position: fixed;
  z-index: 1;
  right: 0;
  padding: 5px;
`

class Home extends Component<Props> {
  render() {
    return (
      <Root>
        <LeftNav />
        <SdkVersion>Mainframe SDK Version: {this.props.apiVersion}</SdkVersion>
        {this.props.initial ? (
          <InitialState setInitialFalse={this.props.setInitialFalse} />
        ) : (
          <MainArea />
        )}
      </Root>
    )
  }
}

export default applyContext(Home)
