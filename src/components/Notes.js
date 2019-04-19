import React from 'react'
import styled, { css } from 'styled-components/native'
import { convertFromRaw } from 'draft-js'
import { Image } from 'react-native'
import { Text } from '@morpheus-ui/core'
import { type Note } from '../types'

const NoteContainer = styled.Text`
  ${props =>
    props.isOpen &&
    css`
      background-color: ${props => props.theme.lightYellow};
    `}
  padding: 10px 13px;
  border-bottom: 1px solid #e3e3e3;
  cursor: pointer;
  display: flex;
  flex-direction: column;
`
const FolderFlatList = styled.FlatList`
  display: block;
`
const TextContainer = styled.View`
  margin-left: 10px;
  margin-bottom: 2px;
  cursor: pointer;
  display: block;
`
const ImageTextContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin-left: 11px;
  margin-top: 3px;
`

type Props = {
  data: Array<Note>,
  folderName: string,
  activeNote: Note,
  isOpen: boolean,
  handleClick: Note => void,
  dragStart: (Event, string) => void,
}

function contentPreview(content) {
  const newContent = convertFromRaw(JSON.parse(content))
    .getPlainText()
    .replace(/[\n\r]/g, ' ')
  const clippedContent =
    newContent.length > 25
      ? newContent.substring(0, 22).concat('...')
      : newContent
  return clippedContent
}

function formattedDate(timestamp) {
  const today = new Date(timestamp).toLocaleDateString(undefined, {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  })
  return today
}

export function formattedTime(timestamp) {
  const time = new Date(timestamp).toLocaleTimeString(undefined, {
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
  })
  return time
}

const Notes = (props: Props) => {
  return (
    props.isOpen && (
      <FolderFlatList
        data={props.data}
        renderItem={({ item }) => {
          const dateTime = new Date(item.date)
          const date = formattedDate(dateTime)
          const time = formattedTime(dateTime)
          const formattedTitle = item.title
            ? item.title.length > 20
              ? item.title.slice(0, 20).concat('...')
              : item.title
            : 'Title...'
          return (
            item.invisible !== true && (
              <NoteContainer
                draggable={true}
                onDragStart={e => props.dragStart(e, item.key)}
                isOpen={props.activeNote.key === item.key}
                onClick={() => props.handleClick(item)}>
                <TextContainer>
                  <Text variant="bold">{formattedTitle}</Text>
                </TextContainer>
                <TextContainer>
                  <Text variant="smaller">
                    {item.content
                      ? item.content && contentPreview(item.content)
                      : 'Start typing...'}
                  </Text>
                </TextContainer>
                <TextContainer>
                  <Text variant="date">{date + '    ' + time}</Text>
                </TextContainer>
                {item.folder.type !== 'all' && item.folder.type !== 'empty' && (
                  <ImageTextContainer>
                    <Image
                      source={require('./img/folder.svg')}
                      style={{ width: 13, height: 11, marginRight: 5 }}
                    />
                    <Text variant={['smaller', 'folder']}>
                      {item.folder.name}
                    </Text>
                  </ImageTextContainer>
                )}
              </NoteContainer>
            )
          )
        }}
      />
    )
  )
}

export default Notes
