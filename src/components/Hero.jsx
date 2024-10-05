import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { motion, useAnimation } from 'framer-motion';
import { IoIosArrowDown } from 'react-icons/io';
import { loadFull } from 'tsparticles';
import { useInView } from 'react-intersection-observer';

// Lazy load Typewriter and Particles to improve initial load performance
const Typewriter = lazy(() => import('typewriter-effect'));
const Particles = lazy(() => import('react-tsparticles'));

/**
 * ParticleBackground Component
 * Renders the particle effect using react-tsparticles.
 */
const ParticleBackground = ({ darkMode, particleCount }) => {
  const particlesInit = useCallback(async (main) => {
    await loadFull(main);
  }, []);

  return (
    <Suspense fallback={null}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          particles: {
            number: {
              value: particleCount,
              density: { enable: true, area: 800 },
            },
            color: { value: darkMode ? '#ffffff' : '#000000' },
            shape: { type: 'circle' },
            opacity: { value: 0.3 },
            size: { value: { min: 1, max: 5 } },
            move: {
              enable: true,
              speed: 1,
              direction: 'none',
              outModes: { default: 'out' },
            },
          },
          interactivity: {
            events: {
              onHover: { enable: false },
              onClick: { enable: false },
            },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 z-0"
      />
    </Suspense>
  );
};

ParticleBackground.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  particleCount: PropTypes.number.isRequired,
};

/**
 * Hero Component
 * Main hero section with animated text, particle background, and scroll down arrow.
 */
const Hero = ({ darkMode = false }) => {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const [particleCount, setParticleCount] = useState(getParticleCount());

  // Determine particle count based on window width
  function getParticleCount() {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 20;
      if (window.innerWidth < 768) return 30;
      return 50;
    }
    return 50; // Default particle count for SSR
  }

  // Handle window resize to adjust particle count
  useEffect(() => {
    const handleResize = () => {
      setParticleCount(getParticleCount());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Start animations when component is in view
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Scroll to the About section smoothly
  const scrollToAbout = useCallback(() => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Animation Variants
  const letterVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * 0.05, duration: 0.5 },
    }),
  };

  const paragraphVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 1.5, duration: 1 } },
  };

  const sentence = 'Welcome to My Portfolio';

  return (
    <section
      id="hero"
      ref={ref}
      className={`relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
      }`}
      aria-labelledby="hero-title"
    >
      {/* Parallax Background Image */}
      <div
        className="absolute inset-0 bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: 'url("/path-to-your-image.jpg")', // Update with your image path
          zIndex: -3,
        }}
        aria-hidden="true"
      ></div>

      {/* Particle Effect */}
      {particleCount > 0 && <ParticleBackground darkMode={darkMode} particleCount={particleCount} />}

      {/* Responsive Overlay */}
      <div
        className="absolute inset-0 bg-opacity-50"
        style={{
          backgroundColor: darkMode
            ? 'rgba(0, 0, 0, 0.5)'
            : 'rgba(255, 255, 255, 0.5)',
          zIndex: -2,
        }}
        aria-hidden="true"
      ></div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Animated Heading */}
        <motion.h1
          id="hero-title"
          className={`text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold mb-6 sm:mb-8 shadow-lg`}
          initial="hidden"
          animate={controls}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
          aria-label={sentence}
        >
          {sentence.split('').map((char, index) => (
            <motion.span
              key={index}
              custom={index}
              variants={letterVariants}
              className="inline-block"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subheading with Typewriter Effect */}
        <motion.p
          className="text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl px-4 sm:px-0 mb-8 sm:mb-12"
          initial="hidden"
          animate={controls}
          variants={paragraphVariants}
        >
          <Suspense fallback={<span>Loading...</span>}>
            <Typewriter
              options={{
                strings: [
                  'DevOps Engineer',
                  'Cloud Enthusiast',
                  'Automation Expert',
                ],
                autoStart: true,
                loop: true,
                delay: 50,
                deleteSpeed: 30,
              }}
            />
          </Suspense>
        </motion.p>
      </div>

      {/* Scroll Down Arrow */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Scroll down to About section"
      >
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          whileHover={{ scale: 1.1 }}
          className="flex flex-col items-center"
        >
          <span
            className={`text-xs sm:text-sm mb-2 transition-colors duration-200 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}
          >
            Scroll Down
          </span>
          <IoIosArrowDown
            size={24}
            color={darkMode ? '#ffffff' : '#000000'}
            aria-hidden="true"
          />
        </motion.div>
      </button>
    </section>
  );
};

Hero.propTypes = {
  darkMode: PropTypes.bool,
};

export default React.memo(Hero);
