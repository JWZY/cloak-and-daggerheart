import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import DesignSystemPage from './app/DesignSystem'
import DesignLab from './app/DesignLab'
import PickerLab from './app/PickerLab'
import AuraLab from './app/AuraLab'
import './index.css'

const params = new URLSearchParams(window.location.search)
const Root = params.has('components') || params.has('audit')
  ? DesignSystemPage
  : params.has('cards')
    ? DesignLab
    : params.has('pickers')
      ? PickerLab
      : params.has('aura')
        ? AuraLab
        : App

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
