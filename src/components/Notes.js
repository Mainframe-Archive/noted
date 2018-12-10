import React from 'react'
import styled, { css } from 'styled-components/native'
import { convertFromRaw } from 'draft-js'
import { type Note } from '../types'

const NoteContainer = styled.View`
  border-radius: 5px;
  ${props =>
    props.isOpen &&
    css`
      background-color: #ffd953;
    `}
  padding: 10px 0;
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
  color: ${props => props.theme.black};
  margin-left: 10px;
  margin-bottom: 5px;
`

type Props = {
  data: Array<Note>,
  folderName: string,
  activeNote: Note,
  isOpen: boolean,
  handleClick: Note => void,
  dragStart: (Event, string) => void,
}

const Notes = (props: Props) => {
  console.log(props.activeNote.folder)
  console.log(props.folderName)
  console.log(props.isOpen)
  return (
    (props.activeNote.folder === props.folderName || props.isOpen) && (
      <FolderFlatList
        isOpen={props.isOpen}
        data={props.data}
        renderItem={({ item }) => {
          return (
            item.invisible !== true && (
              <NoteContainer
                //u left off here
                // isOpen={props.activeNote.key === }
                onClick={() => props.handleClick(item)}>
                <Text draggable onDragStart={e => props.dragStart(e, item.key)}>
                  {item.title ? item.title : 'untitled'}
                </Text>
                <NotePreview>
                  {item.content
                    ? item.content &&
                      convertFromRaw(JSON.parse(item.content))
                        .getPlainText()
                        .substring(0, 15)
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
