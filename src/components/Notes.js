import React from 'react'
import styled, { css } from 'styled-components/native'
import { convertFromRaw } from 'draft-js'
import { type Note } from '../types'

const NoteContainer = styled.View`
  background-color: #ffffcc;
  border: 1px solid #a6a6a6;
  cursor: pointer;
`
const FolderFlatList = styled.FlatList`
  display: block;
`
const Text = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.black};
  font-weight: bold;
  margin-left: 10px;
  margin-bottom: 5px;
  cursor: pointer;
  display: block;
`
const NotePreview = styled.Text`
  font-size: 12px;
  color: #a6a6a6;
  margin-left: 10px;
  margin-bottom: 5px;
`

type Props = {
  data: Array<Note>,
  folderID: string,
  folderName: string,
  folderDraggable: boolean,
  open: boolean,
  edit: boolean,
  handleClick: Note => void,
  onDragOver?: Event => void,
  onDrop?: (Event, string) => void,
  archive?: Event => void,
  onChangeText?: string => void,
  onSubmitEditing?: () => void,
}

const Notes = (props: Props) => {
  return (
    props.open && (
      <FolderFlatList
        open={props.open}
        data={props.data}
        renderItem={({ item }) => {
          return (
            item.invisible !== true && (
              <NoteContainer
                draggable
                onDragStart={e => props.dragStart(e, item.key)}
                onClick={() => props.handleClick(item)}>
                <Text>{item.title ? item.title : 'untitled'}</Text>
                <NotePreview>
                  {item.content
                    ? item.content &&
                      convertFromRaw(JSON.parse(item.content))
                        .getPlainText()
                        .substring(0, 10)
                    : 'start typing...'}
                </NotePreview>
              </NoteContainer>
            )
          )
        }}
      />
    )
  )
}

export default Notes
