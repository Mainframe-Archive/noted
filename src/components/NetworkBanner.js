// @flow

import React, { Component } from 'react'
import { Text, Button } from '@morpheus-ui/core'
import { Close } from '@morpheus-ui/icons'
import styled from 'styled-components/native'
import applyContext from '../hocs/Context'
import { type Assets } from '../types'

type State = {
  ticker: string,
}

type Props = {
  assets: Assets,
  error: string,
  network: string,
  dismissBanner: () => void,
}

const Container = styled.View`
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.darkYellow};
`

const CloseButtonContainer = styled.View`
  position: absolute;
  right: 15px;
  top: 15px;
`

class Banner extends Component<Props, State> {
  render() {
    return (
      <Container>
        <Text color="#fff">{this.props.backupResult}</Text>
        <CloseButtonContainer>
          <Button
            Icon={Close}
            onPress={() => this.props.dismissBanner()}
            variant={['no-border', 'whiteClose']}
          />
        </CloseButtonContainer>
      </Container>
    )
  }
}

export default applyContext(Banner)
