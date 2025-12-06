import { motion } from 'framer-motion'
import Card from '../components/Card'
import './ExploreView.css'

export default function ExploreView() {
  const discoveries = [
    { id: '1', title: 'Ancient Ruins', location: 'Northern Peaks', emoji: '🏛️' },
    { id: '2', title: 'Hidden Grove', location: 'Whispering Woods', emoji: '🌳' },
    { id: '3', title: 'Crystal Cave', location: 'Eastern Mountains', emoji: '💎' },
    { id: '4', title: 'Lost City', location: 'Desert Wastes', emoji: '🏜️' },
    { id: '5', title: 'Mystic Lake', location: 'Central Valley', emoji: '🌊' },
  ]

  return (
    <div className="explore-view">
      <div className="view-header">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          Explore
        </motion.h1>
        <p className="view-subtitle">Discover new locations</p>
      </div>

      <div className="ios-scroll view-content">
        <div className="explore-list">
          {discoveries.map((discovery, index) => (
            <motion.div
              key={discovery.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
                delay: index * 0.05,
              }}
            >
              <Card className="explore-card">
                <div className="explore-card-content">
                  <div className="explore-emoji">{discovery.emoji}</div>
                  <div className="explore-info">
                    <h3 className="explore-title">{discovery.title}</h3>
                    <p className="explore-location">{discovery.location}</p>
                  </div>
                  <div className="explore-chevron">›</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

