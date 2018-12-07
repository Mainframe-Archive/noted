import React from 'react'
import styled from 'styled-components/native'
import { type Note } from '../types'

const FolderContainer = styled.View`
  display: inline;
`

const FolderText = styled.TextInput`
  font-size: 15px;
  color: ${props => props.theme.black};
  margin-bottom: 5px;
  margin-top: 10px;
  cursor: pointer;
`

type Props = {
  data: Array<Note>,
  folderID: string,
  folderName: string,
  folderDraggable: boolean,
  edit: boolean,
  handleClick: Note => void,
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
        draggable={props.folderDraggable}
        editable={props.edit}
        defaultValue={props.folderName}
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
