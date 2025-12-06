import { useState } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { Drawer } from 'vaul'
import HomeView from './views/HomeView'
import ExploreView from './views/ExploreView'
import ProfileView from './views/ProfileView'
import TabBar from './components/TabBar'
import './App.css'

// iOS-native spring configuration
const spring = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 0.8
}

const views = ['home', 'explore', 'profile'] as const
type View = typeof views[number]

function App() {
  const [currentView, setCurrentView] = useState<View>('home')
  const [direction, setDirection] = useState(0)

  const viewIndex = views.indexOf(currentView)

  const handleSwipe = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50
    const velocity = info.velocity.x
    const offset = info.offset.x

    if (Math.abs(velocity) > 500 || Math.abs(offset) > threshold) {
      if (offset > 0 && viewIndex > 0) {
        // Swipe right - go to previous view
        setDirection(-1)
        setCurrentView(views[viewIndex - 1])
      } else if (offset < 0 && viewIndex < views.length - 1) {
        // Swipe left - go to next view
        setDirection(1)
        setCurrentView(views[viewIndex + 1])
      }
    }
  }

  const handleTabChange = (view: View) => {
    const newIndex = views.indexOf(view)
    setDirection(newIndex > viewIndex ? 1 : -1)
    setCurrentView(view)
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0.5
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0.5
    })
  }

  return (
    <div className="app">
      {/* Safe area top spacer for iOS notch */}
      <div className="safe-area-top" />
      
      {/* Swipeable view container */}
      <div className="view-container">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={currentView}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={spring}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleSwipe}
            className="view-wrapper"
          >
            {currentView === 'home' && <HomeView />}
            {currentView === 'explore' && <ExploreView />}
            {currentView === 'profile' && <ProfileView />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* iOS-style tab bar */}
      <TabBar currentView={currentView} onViewChange={handleTabChange} />
      
      {/* Safe area bottom spacer for iOS home indicator */}
      <div className="safe-area-bottom" />
    </div>
  )
}

export default App

