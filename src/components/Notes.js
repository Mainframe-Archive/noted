import React from 'react'
import styled from 'styled-components/native'
import { convertFromRaw } from 'draft-js'
import { type Note } from '../types'

const NoteContainer = styled.View`
  /* background-color: #ffffcc; */
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
  folderID: string,
  folderName: string,
  open: boolean,
  handleClick: Note => void,
  dragStart: (Event, string) => void,
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
              <NoteContainer onClick={() => props.handleClick(item)}>
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
