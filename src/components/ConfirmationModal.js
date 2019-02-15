// @flow

import React, { Component } from 'react'
import { Modal } from 'react-overlays'
import { Button } from '@morpheus-ui/core'
import { Text } from 'react-native-web'
import styled from 'styled-components/native'

type Props = {
  show: boolean,
  close: () => void,
  confirmationFunction: () => void,
  confirmationOption: string,
  cancelOption: string,
  question: string,
}

const modalStyle = {
  position: 'fixed',
  zIndex: 99999999,
  margin: '0 auto',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}

const BackgroundView = styled.View`
  zIndex: 'auto',
  backgroundColor: rgba(255, 255, 255, 0.95);
  position: fixed;
  zIndex: 99999999;
  margin: 0 auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flexDirection: column;
  alignItems: center;
  justifyContent: center;
`

const ButtonContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 200px;
  margin-top: 30px;
`

class ConfirmationModal extends Component<Props> {
  render() {
    return (
      <Modal
        aria-labelledby="modal-label"
        style={modalStyle}
        show={this.props.show}>
        <BackgroundView>
          <Text id="modal-question">{this.props.question}</Text>
          <ButtonContainer>
            <Button
              title={this.props.cancelOption}
              onPress={this.props.close}
              variant={'borderless'}
            />
            <Button
              title={this.props.confirmationOption}
              onPress={this.props.confirmationFunction}
              variant={'yellow'}
            />
          </ButtonContainer>
        </BackgroundView>
      </Modal>
    )
  }
}

export default ConfirmationModal
