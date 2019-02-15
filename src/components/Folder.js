import React from 'react'
import styled, { css } from 'styled-components/native'
import { type Note, type Folder as FolderType } from '../types'

const FolderContainer = styled.View`
  width: 100%;
  diplay: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-top: 10px;
`
const FolderText = styled.TextInput`
  flex: 1;
  color: ${props => props.theme.mediumGray};
  max-width: 135px;
  font-size: 15px;
  cursor: pointer;
  padding-left: 10px;
  ${props =>
    props.isOpen &&
    css`
      font-weight: bold;
      color: ${props => props.theme.black};
    `}
`
const Triangle = styled.View`
  width: 0;
  height: 0;
  left: 0;
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
  border-left: 12px solid ${props => props.theme.yellow};
  ${props =>
    !props.isOpen &&
    css`
      border-left: 12px solid transparent;
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
      <Triangle isOpen={props.isOpen} />
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
