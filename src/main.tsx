import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import DesignLab from './app/DesignLab'
import DesignSystem from './app/DesignSystem'
import './index.css'

const params = new URLSearchParams(window.location.search)
const Root = params.has('components')
  ? DesignSystem
  : params.has('cards')
    ? DesignLab
    : App

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
