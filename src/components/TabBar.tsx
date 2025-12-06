import { motion } from 'framer-motion'
import './TabBar.css'

type View = 'home' | 'explore' | 'profile'

interface TabBarProps {
  currentView: View
  onViewChange: (view: View) => void
}

const tabs = [
  { id: 'home' as View, icon: '🏠', label: 'Home' },
  { id: 'explore' as View, icon: '🔍', label: 'Explore' },
  { id: 'profile' as View, icon: '👤', label: 'Profile' },
]

export default function TabBar({ currentView, onViewChange }: TabBarProps) {
  return (
    <div className="tab-bar">
      {tabs.map((tab) => {
        const isActive = currentView === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onViewChange(tab.id)}
            className="tab-button"
          >
            <motion.div
              animate={{
                scale: isActive ? 1 : 0.9,
                opacity: isActive ? 1 : 0.5,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="tab-content"
            >
              <div className="tab-icon">{tab.icon}</div>
              <div className={`tab-label ${isActive ? 'active' : ''}`}>
                {tab.label}
              </div>
            </motion.div>
          </button>
        )
      })}
    </div>
  )
}

