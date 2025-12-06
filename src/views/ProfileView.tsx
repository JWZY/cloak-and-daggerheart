import { motion } from 'framer-motion'
import Card from '../components/Card'
import './ProfileView.css'

export default function ProfileView() {
  const stats = [
    { label: 'Level', value: '12', emoji: '⭐' },
    { label: 'Quests', value: '23', emoji: '📋' },
    { label: 'Gold', value: '1,450', emoji: '💰' },
  ]

  const settings = [
    { id: '1', label: 'Character Stats', icon: '📊' },
    { id: '2', label: 'Inventory', icon: '🎒' },
    { id: '3', label: 'Achievements', icon: '🏆' },
    { id: '4', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <div className="profile-view">
      <div className="view-header">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          Profile
        </motion.h1>
        <p className="view-subtitle">Your character</p>
      </div>

      <div className="ios-scroll view-content">
        {/* Character Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="profile-avatar-section"
        >
          <div className="profile-avatar">🧙‍♂️</div>
          <h2 className="profile-name">Adventurer</h2>
          <p className="profile-class">Rogue • Shadow Walker</p>
        </motion.div>

        {/* Stats */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
                delay: 0.1 + index * 0.05,
              }}
            >
              <Card className="stat-card">
                <div className="stat-emoji">{stat.emoji}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Settings List */}
        <div className="settings-list">
          {settings.map((setting, index) => (
            <motion.div
              key={setting.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
                delay: 0.2 + index * 0.05,
              }}
            >
              <Card className="setting-card">
                <div className="setting-content">
                  <span className="setting-icon">{setting.icon}</span>
                  <span className="setting-label">{setting.label}</span>
                  <span className="setting-chevron">›</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

