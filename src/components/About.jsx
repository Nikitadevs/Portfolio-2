import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCode,
  faLaptopCode,
  faLightbulb,
  faDownload,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';

const About = ({ darkMode }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleDownloadClick = useCallback(() => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadComplete(false);

    // Simulate the download process
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadComplete(true);
      setTimeout(() => setDownloadComplete(false), 3000);
    }, 2000);

    // Trigger the actual file download
    const link = document.createElement('a');
    link.href = '/path-to-your-resume.pdf'; 
    link.download = 'Nikita_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [isDownloading]);

  const features = [
    {
      icon: faCode,
      title: 'Infrastructure as Code',
      description:
        'Build and manage infrastructure with tools like Terraform and Ansible.',
    },
    {
      icon: faLaptopCode,
      title: 'CI/CD',
      description:
        'Automate software delivery with continuous integration and deployment pipelines.',
    },
    {
      icon: faLightbulb,
      title: 'Cloud Infrastructure',
      description:
        'Design and manage secure, scalable cloud infrastructure on AWS, Azure, and more.',
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const FeatureCard = ({ item }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.05 }}
      className={`rounded-xl p-8 flex flex-col items-center transform transition-all duration-300 shadow-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } hover:shadow-2xl focus:outline-none focus:ring-4 ${
        darkMode ? 'focus:ring-blue-300' : 'focus:ring-blue-500'
      }`}
      tabIndex={0}
      role="button"
      aria-pressed="false"
      aria-label={item.title}
    >
      <FontAwesomeIcon
        icon={item.icon}
        className="text-5xl text-blue-500 mb-4"
        aria-hidden="true"
      />
      <h3 className="text-2xl font-bold mb-2 text-center">{item.title}</h3>
      <p className="text-base text-center">{item.description}</p>
    </motion.div>
  );

  return (
    <motion.section
      id="about"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`py-16 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center px-6 md:px-12">
        <motion.div
          className="md:w-1/3 flex flex-col items-center md:items-start mb-8 md:mb-0"
          variants={itemVariants}
        >
          <motion.img
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            src="/path-to-your-image.jpg"
            alt="Nikita's Profile Picture"
            className="w-40 h-40 md:w-48 md:h-48 rounded-full shadow-lg object-cover mb-6 border-4 border-blue-500"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadClick}
            className={`px-6 py-3 ${
              darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            } text-white font-bold rounded-full shadow-md flex items-center space-x-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
              darkMode ? 'focus:ring-blue-300' : 'focus:ring-blue-500'
            }`}
            disabled={isDownloading || downloadComplete}
            aria-live="polite"
            aria-label="Download Resume"
          >
            {isDownloading ? (
              <>
                <motion.div
                  className="loader-spinner border-t-4 border-white border-solid rounded-full w-5 h-5"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                />
                <span>Downloading...</span>
              </>
            ) : downloadComplete ? (
              <>
                <FontAwesomeIcon icon={faCheckCircle} />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faDownload} />
                <span>Download Resume</span>
              </>
            )}
          </motion.button>
        </motion.div>

        <motion.div
          className="md:w-2/3 flex flex-col items-center md:items-start text-center md:text-left space-y-4 px-4 md:px-0"
          variants={itemVariants}
        >
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">Hi, I'm Nikita</h1>
          <p className="text-lg md:text-xl leading-relaxed">
            I’m a passionate DevOps engineer focused on automating and optimizing mission-critical deployments. I love leveraging CI/CD, cloud
            infrastructure, and containerization to build scalable and efficient systems.
          </p>
          <p className="text-lg md:text-xl leading-relaxed">
            I thrive on staying ahead with the latest technologies, contributing to open-source projects, and tackling challenging problems with innovative solutions.
          </p>
          <div className="flex space-x-6 mt-4">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-500 transition-colors"
              aria-label="GitHub"
            >
              <FontAwesomeIcon icon={['fab', 'github']} size="2x" />
            </a>
            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-500 transition-colors"
              aria-label="LinkedIn"
            >
              <FontAwesomeIcon icon={['fab', 'linkedin']} size="2x" />
            </a>
            <a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-500 transition-colors"
              aria-label="Twitter"
            >
              <FontAwesomeIcon icon={['fab', 'twitter']} size="2x" />
            </a>
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto mt-16 px-6 md:px-12">
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={containerVariants}>
          {features.map((item, index) => (
            <FeatureCard key={index} item={item} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default About;
