import { motion } from 'framer-motion';
import { IoIosArrowDown } from 'react-icons/io';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { useInView } from 'react-intersection-observer';
import Typewriter from 'typewriter-effect';
import PropTypes from 'prop-types';

const Hero = ({ darkMode }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sentence = 'Welcome to My Portfolio';

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

  return (
    <section
      id="hero"
      ref={ref}
      className={`relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
      }`}
      aria-labelledby="hero-title"
    >
      {/* Parallax Background Image */}
      <div
        className="absolute inset-0 bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: 'url("/path-to-your-image.jpg")', // Update with your image path
          zIndex: -2,
        }}
        aria-hidden="true"
      ></div>

      {/* Particle Effect */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          particles: {
            number: { value: 50, density: { enable: true, area: 800 } },
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

      {/* Responsive Overlay */}
      <div
        className="absolute inset-0 bg-opacity-50"
        style={{
          backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
          zIndex: -1,
        }}
        aria-hidden="true"
      ></div>

      {/* Animated Text with Enhanced Shadow for Mobile */}
      <motion.h1
        id="hero-title"
        className="text-3xl sm:text-4xl md:text-6xl font-bold text-center mb-4"
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
        aria-label="Welcome to My Portfolio"
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
        className="text-lg sm:text-xl md:text-2xl text-center max-w-2xl px-4 sm:px-0"
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={paragraphVariants}
      >
        <Typewriter
          options={{
            strings: ['DevOps Engineer', 'Cloud Enthusiast', 'Automation Expert'],
            autoStart: true,
            loop: true,
            delay: 50,
            deleteSpeed: 30,
          }}
        />
      </motion.p>

      {/* Scroll Down Arrow */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-20 cursor-pointer focus:outline-none"
        aria-label="Scroll down to About section"
      >
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          whileHover={{ scale: 1.1 }}
          className="flex flex-col items-center"
        >
          <span
            className={`text-sm mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}
          >
            Scroll Down
          </span>
          <IoIosArrowDown
            size={30}
            color={darkMode ? '#ffffff' : '#000000'}
          />
        </motion.div>
      </button>
    </section>
  );
};

Hero.propTypes = {
  darkMode: PropTypes.bool.isRequired,
};

export default Hero;
