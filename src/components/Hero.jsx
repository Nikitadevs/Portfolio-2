import { motion } from 'framer-motion';
import { IoIosArrowDown } from 'react-icons/io';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { useInView } from 'react-intersection-observer';
import Typewriter from 'typewriter-effect';

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
          backgroundImage: 'url("/path-to-your-image.jpg")', // Replace with your image path
          zIndex: -2,
        }}
      ></div>

      {/* Particle Effect */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          particles: {
            number: { value: 50 },
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
        }}
        className="absolute inset-0 z-0"
      />

      {/* Overlay for better contrast */}
      <div
        className={`absolute inset-0 ${
          darkMode ? 'bg-black opacity-50' : 'bg-white opacity-60'
        }`}
        style={{ zIndex: -1 }}
      ></div>

      {/* Animated Text */}
      <motion.h1
        id="hero-title"
        className="text-3xl sm:text-4xl md:text-6xl font-bold text-center mb-4"
      >
        {sentence.split('').map((char, index) => (
          <motion.span
            key={index}
            initial={{ y: 50, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.h1>

      {/* Subheading with Typewriter Effect */}
      <motion.p
        className="text-lg sm:text-xl md:text-2xl text-center max-w-2xl px-4 sm:px-0"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.5 }}
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

     {/* Scroll Down Arrow */}
<div
  onClick={scrollToAbout}
  className="absolute bottom-20 cursor-pointer"
  role="button"
  tabIndex={0}
  onKeyDown={(e) => e.key === 'Enter' && scrollToAbout()}
  aria-label="Scroll down to About section"
>
  <motion.div
    animate={{
      y: [0, 15, 0],
    }}
    transition={{
      repeat: Infinity,
      duration: 1.5,
      ease: 'easeInOut',
    }}
    whileHover={{ scale: 1.1 }}
    className="flex flex-col items-center"
  >
    <span
      className={`text-sm ${
        darkMode ? 'text-gray-200' : 'text-gray-700'
      } mb-6`}
    >
      Scroll Down
    </span>
    <IoIosArrowDown
      size={30}
      color={darkMode ? '#ffffff' : '#000000'}
      className=""
    />
  </motion.div>
</div>
    </section>
  );
};

export default Hero;
