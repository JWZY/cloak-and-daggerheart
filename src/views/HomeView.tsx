import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '../components/Card'
import Sheet from '../components/Sheet'
import './HomeView.css'

export default function HomeView() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const handleCardClick = (item: string) => {
    setSelectedItem(item)
    setSheetOpen(true)
  }

  const items = [
    { id: '1', title: 'Cloak', subtitle: 'Stealth mechanics', emoji: '🥷' },
    { id: '2', title: 'Dagger', subtitle: 'Combat system', emoji: '🗡️' },
    { id: '3', title: 'Heart', subtitle: 'Character bonds', emoji: '❤️' },
    { id: '4', title: 'Quest', subtitle: 'Adventure log', emoji: '📜' },
  ]

  return (
    <div className="home-view">
      <div className="view-header">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          Cloak & Daggerheart
        </motion.h1>
        <p className="view-subtitle">Your adventure awaits</p>
      </div>

      <div className="ios-scroll view-content">
        <div className="card-grid">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
                delay: index * 0.1,
              }}
            >
              <Card onClick={() => handleCardClick(item.title)}>
                <div className="card-emoji">{item.emoji}</div>
                <h3 className="card-title">{item.title}</h3>
                <p className="card-subtitle">{item.subtitle}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen} title={selectedItem || ''}>
        <div className="sheet-content-example">
          <p className="sheet-text">
            This is an iOS-style bottom sheet with native physics.
          </p>
          <p className="sheet-text">
            Drag the handle or swipe down to dismiss.
          </p>
          <motion.button
            className="ios-button"
            onClick={() => setSheetOpen(false)}
            whileTap={{ scale: 0.96 }}
          >
            Close
          </motion.button>
        </div>
      </Sheet>
    </div>
  )
}

