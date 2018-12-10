import React from 'react'
import styled, { css } from 'styled-components/native'
import { type Note } from '../types'

const FolderContainer = styled.View`
  display: inline;
  padding: 0 5px;
`

const FolderText = styled.TextInput`
  color: ${props => props.theme.mediumGray};
  font-size: 15px;
  margin-bottom: 5px;
  margin-top: 10px;
  cursor: pointer;
  padding-left: 10px;
  ${props =>
    props.isopen &&
    css`
      border-left: 6px solid ${props => props.theme.yellow};
      margin-left: -6px;
      font-weight: bold;
      color: ${props => props.theme.black};
    `}
`

type Props = {
  folderID: string,
  folderName: string,
  isOpen: boolean,
  isBeingEdited: boolean,
  handleClick: Note => void,
  handleDoubleClick: () => void,
  onDragOver?: Event => void,
  onDrop?: (Event, string) => void,
  archive?: Event => void,
  onChangeText?: string => void,
  onSubmitEditing?: () => void,
}

const Folder = (props: Props) => {
  return (
    <FolderContainer>
      <FolderText
        isopen={props.isOpen}
        draggable={props.folderDraggable}
        editable={props.isBeingEdited}
        defaultValue={props.folderName}
        onDoubleClick={props.handleDoubleClick}
        onClick={() => props.handleClick(props.folderID)}
        onDragOver={props.onDragOver && (e => props.onDragOver(e))}
        onDrop={
          props.archive
            ? e => props.archive(e)
            : props.onDrop && (e => props.onDrop(e, props.folderName))
        }
        onChangeText={props.onChangeText && (text => props.onChangeText(text))}
        onSubmitEditing={props.onSubmitEditing && props.onSubmitEditing}
      />
    </FolderContainer>
  )
}

export default Folder
