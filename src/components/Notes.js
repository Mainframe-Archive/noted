import React from 'react'
import styled, { css } from 'styled-components/native'
import { convertFromRaw } from 'draft-js'
import { type Note } from '../types'

const NoteContainer = styled.View`
  ${props =>
    props.isOpen &&
    css`
      background-color: ${props => props.theme.lightYellow};
    `}
  padding: 10px 0;
  border-bottom: 1px solid ${props => props.theme.mediumGray};
  cursor: pointer;
`
const FolderFlatList = styled.FlatList`
  display: block;
  padding: ${props => props.theme.spacing} 0px;
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
const NoteDate = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.mediumGray};
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
  return (
    props.isOpen && (
      <FolderFlatList
        isOpen={props.isOpen}
        data={props.data}
        renderItem={({ item }) => {
          const date = new Date(item.date)
          return (
            item.invisible !== true && (
              <NoteContainer
                isOpen={props.activeNote.key === item.key}
                onClick={() => props.handleClick(item)}>
                <Text draggable onDragStart={e => props.dragStart(e, item.key)}>
                  {item.title ? item.title : 'untitled'}
                </Text>
                <NotePreview>
                  {item.content
                    ? item.content &&
                      convertFromRaw(JSON.parse(item.content))
                        .getPlainText()
                        .replace(/[\n\r]/g, ' ')
                        .substring(0, 25)
                    : 'start typing...'}
                </NotePreview>
                <NoteDate>
                  {date.toString().replace(/\sGMT-\d{4,}\s\(\w{3,}\)/gi, '')}
                </NoteDate>
              </NoteContainer>
            )
          )
        }}
      />
    )
  )
}

export default Notes
