import { motion } from 'framer-motion';
import { IoIosArrowDown } from 'react-icons/io';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { useInView } from 'react-intersection-observer';
import Typewriter from 'typewriter-effect';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Ensure this import is present

const SocialLink = ({ href, icon, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="relative group mx-2"
    whileHover={{ scale: 1.1 }}
    aria-label={label}
  >
    <FontAwesomeIcon icon={icon} className="text-2xl md:text-3xl" />
    {/* Tooltip */}
    <motion.span
      className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      {label}
    </motion.span>
  </motion.a>
);

SocialLink.propTypes = {
  href: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
};

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

  // State to handle particle count based on screen width
  const [particleCount, setParticleCount] = useState(
    window.innerWidth < 640 ? 20 : window.innerWidth < 768 ? 30 : 50
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setParticleCount(20);
      } else if (window.innerWidth < 768) {
        setParticleCount(30);
      } else {
        setParticleCount(50);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          zIndex: -2,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
        aria-hidden="true"
      ></div>

      {/* Particle Effect */}
      {particleCount > 0 && (
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fullScreen: { enable: false },
            particles: {
              number: { value: particleCount, density: { enable: true, area: 800 } },
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
      )}

      {/* Responsive Overlay */}
      <div
        className="absolute inset-0 bg-opacity-50"
        style={{
          backgroundColor: darkMode
            ? 'rgba(0, 0, 0, 0.5)'
            : 'rgba(255, 255, 255, 0.5)',
          zIndex: -1,
        }}
        aria-hidden="true"
      ></div>

      {/* Enhanced Animated Text */}
      <motion.h1
        id="hero-title"
        className={`text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold text-center mb-6 sm:mb-8 shadow-lg ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}
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
        className="text-sm sm:text-base md:text-lg lg:text-xl text-center max-w-2xl px-4 sm:px-0 mb-8 sm:mb-12"
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={paragraphVariants}
      >
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
      </motion.p>

      {/* Social Links (Visible on Mobile) */}
      <div className="flex flex-row mb-8 sm:mb-12">
        {/* Add your social links here using the SocialLink component */}
        {/* Example:
        <SocialLink href="https://github.com/username" icon={faGithub} label="GitHub" />
        <SocialLink href="https://linkedin.com/in/username" icon={faLinkedin} label="LinkedIn" />
        */}
      </div>

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
            className={`text-xs sm:text-sm mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}
          >
            Scroll Down
          </span>
          <IoIosArrowDown
            size={24} // Adjust size if needed
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
