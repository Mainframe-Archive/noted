import React from 'react'
import styled, { css } from 'styled-components/native'
import { type Note } from '../types'

const Text = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.white};
  margin-left: 10px;
  margin-bottom: 5px;
  cursor: pointer;
  display: block;
`

const FolderContainer = styled.View`
  display: inline;
`

const CollapseFolder = styled.Text`
  color: ${props => props.theme.white};
  font-weight: bold;
  cursor: pointer;
`

const FolderText = styled.TextInput`
  font-size: 15px;
  color: ${props => props.theme.white};
  margin-bottom: 5px;
  margin-top: 10px;
  cursor: pointer;
`

const FolderFlatList = styled.FlatList`
  display: block;
  ${props =>
    !props.isOpen &&
    css`
      display: none;
    `}
`
type Props = {
  data: Array<Note>,
  folderID: string,
  folderName: string,
  folderDraggable: boolean,
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
      <CollapseFolder onClick={() => props.openFolder(props.folderID)}>
        {props.isOpen ? 'v ' : '> '}
      </CollapseFolder>
      <FolderText
        draggable={props.folderDraggable}
        editable={props.isBeingEdited}
        defaultValue={props.folderName}
        onDoubleClick={props.handleDoubleClick}
        onDragOver={props.onDragOver && (e => props.onDragOver(e))}
        onDrop={
          props.archive
            ? e => props.archive(e)
            : props.onDrop && (e => props.onDrop(e, props.folderName))
        }
        onChangeText={props.onChangeText && (text => props.onChangeText(text))}
        onSubmitEditing={props.onSubmitEditing && props.onSubmitEditing}
      />
      <FolderFlatList
        isOpen={props.isOpen}
        data={props.data}
        renderItem={({ item }) => {
          return (
            item.invisible !== true && (
              <Text
                draggable
                onDragStart={e => props.dragStart(e, item.key)}
                onClick={() => props.handleClick(item)}>
                {item.title ? item.title : 'untitled'}
              </Text>
            )
          )
        }}
      />
    </FolderContainer>
  )
}

export default Folder
