import { StyleSheetTestUtils } from 'aphrodite'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

beforeEach(() => {
  StyleSheetTestUtils.suppressStyleInjection()
})
afterEach(() => {
  StyleSheetTestUtils.clearBufferAndResumeStyleInjection()
})

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})
