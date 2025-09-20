import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TestFirebase from './pages/TestFirebase';
import TestStorage from './pages/TestStorage';

const pageVariants = {
  initial: {
    opacity: 0,
    x: -20
  },
  in: {
    opacity: 1,
    x: 0
  },
  out: {
    opacity: 0,
    x: 20
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3
};

const AnimatedRoute = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={
                    <AnimatedRoute>
                      <Home />
                    </AnimatedRoute>
                  } />
                  <Route path="/about" element={
                    <AnimatedRoute>
                      <About />
                    </AnimatedRoute>
                  } />
                  <Route path="/services" element={
                    <AnimatedRoute>
                      <Services />
                    </AnimatedRoute>
                  } />
                  <Route path="/register" element={
                    <AnimatedRoute>
                      <Register />
                    </AnimatedRoute>
                  } />
                  <Route path="/login" element={
                    <AnimatedRoute>
                      <Login />
                    </AnimatedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <AnimatedRoute>
                      <Dashboard />
                    </AnimatedRoute>
                  } />
                  <Route path="/test-firebase" element={
                    <AnimatedRoute>
                      <TestFirebase />
                    </AnimatedRoute>
                  } />
                  <Route path="/test-storage" element={
                    <AnimatedRoute>
                      <TestStorage />
                    </AnimatedRoute>
                  } />
                </Routes>
              </AnimatePresence>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;