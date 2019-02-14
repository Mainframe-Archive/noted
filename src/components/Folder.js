import React from 'react'
import styled, { css } from 'styled-components/native'
import { type Note, type Folder as FolderType } from '../types'

const FolderContainer = styled.View`
  display: inline;
  padding: 0 5px;
`
const FolderText = styled.TextInput`
  color: ${props => props.theme.mediumGray};
  width: 125px;
  font-size: 15px;
  margin-bottom: 5px;
  margin-top: 10px;
  cursor: pointer;
  padding-left: 10px;
  ${props =>
    props.isOpen &&
    css`
      border-left: 9px solid ${props => props.theme.yellow};
      margin-left: -9px;
      font-weight: bold;
      color: ${props => props.theme.black};
    `}
`

type Props = {
  folderID: string,
  folder: FolderType,
  isOpen: boolean,
  isBeingEdited: boolean,
  handleClick: Note => void,
  handleDoubleClick: () => void,
  onDragOver?: Event => void,
  onDragStart?: (Event, string) => void,
  onDrop?: (Event, FolderType) => void,
  archive?: Event => void,
  onChangeText?: string => void,
  onSubmitEditing?: () => void,
}

const Folder = (props: Props) => {
  return (
    <FolderContainer>
      <FolderText
        isOpen={props.isOpen}
        draggable={props.folderDraggable}
        onDragStart={
          props.onDragStart && (e => props.onDragStart(e, props.folder))
        }
        editable={props.isBeingEdited}
        defaultValue={props.folder.name}
        onDoubleClick={props.handleDoubleClick}
        onClick={() => props.handleClick(props.folderID)}
        onDragOver={props.onDragOver && (e => props.onDragOver(e))}
        onDrop={
          props.archive
            ? e => props.archive(e)
            : props.onDrop &&
              (e =>
                props.onDrop(e, {
                  name: props.folder.name,
                  type: props.folder.type,
                }))
        }
        onChangeText={props.onChangeText && (text => props.onChangeText(text))}
        onSubmitEditing={props.onSubmitEditing && props.onSubmitEditing}
      />
    </FolderContainer>
  )
}

export default Folder
