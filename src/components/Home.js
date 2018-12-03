// @flow

import React, { Component } from 'react'
import styled from 'styled-components/native'

import LeftNav from './LeftNav'
import MainArea from './MainArea'
import InitialState from './InitialState'
import MainframeSDK from '@mainframe/sdk'
import applyContext from '../hocs/Context'

type State = {
  initial: boolean,
  apiVersion: string,
}

type Props = {
  mf: MainframeSDK,
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

class Home extends Component<Props, State> {
  state = {
    initial: true,
    apiVersion: '',
  }

  async componentDidMount() {
    // there will likely be a better/ additional deciding factor here
    // once integrated w/ swarm
    if (localStorage.getItem('notes')) {
      this.setState({ initial: false })
    }
    console.log("this.props", this.props)
    this.setState({apiVersion: await this.props.mf.apiVersion()})

  }

  setInitialFalse = () => {
    this.setState({ initial: false })
  }

  render() {
    return (
      <Root>
        <LeftNav />
        <SdkVersion>Mainframe SDK Version: {this.state.apiVersion}</SdkVersion>
        {this.state.initial ? (
          <InitialState setInitialFalse={this.setInitialFalse} />
        ) : (
          <MainArea />
        )}
      </Root>
    )
  }
}

export default applyContext(Home)
