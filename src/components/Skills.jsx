
import { useState, useRef } from 'react';
import {FaDocker,FaAws,FaGitAlt,FaPython,FaLinux,FaJenkins,} from 'react-icons/fa';
import { SiKubernetes, SiAnsible, SiTerraform, SiGo } from 'react-icons/si';
import { motion, AnimatePresence } from 'framer-motion';

const essentialSkills = [
  { 
    name: 'Docker', 
    icon: <FaDocker className="text-4xl sm:text-5xl text-blue-500" />, 
    description: 'Platform for containerizing applications, essential for modern DevOps practices.' 
  },
  { 
    name: 'Kubernetes', 
    icon: <SiKubernetes className="text-4xl sm:text-5xl text-blue-500" />, 
    description: 'System for automating deployment, scaling, and management of containerized applications.' 
  },
  { 
    name: 'AWS', 
    icon: <FaAws className="text-4xl sm:text-5xl text-orange-500" />, 
    description: 'Comprehensive cloud services platform, crucial for cloud infrastructure management.' 
  },
  { 
    name: 'Git', 
    icon: <FaGitAlt className="text-4xl sm:text-5xl text-red-500" />, 
    description: 'Version control system for tracking changes in code and facilitating collaboration.' 
  },
  { 
    name: 'Linux', 
    icon: <FaLinux className="text-4xl sm:text-5xl text-green-500" />, 
    description: 'Operating system widely used in server environments, essential for server management.' 
  },
  { 
    name: 'Jenkins', 
    icon: <FaJenkins className="text-4xl sm:text-5xl text-gray-500" />, 
    description: 'Automation server for continuous integration and delivery pipelines.' 
  },
  { 
    name: 'Ansible', 
    icon: <SiAnsible className="text-4xl sm:text-5xl text-red-500" />, 
    description: 'Tool for configuration management and automation, important for infrastructure as code.' 
  },
  { 
    name: 'Terraform', 
    icon: <SiTerraform className="text-4xl sm:text-5xl text-purple-500" />, 
    description: 'Infrastructure as code tool for provisioning and managing cloud infrastructure.' 
  },
  { 
    name: 'Python', 
    icon: <FaPython className="text-4xl sm:text-5xl text-yellow-500" />, 
    description: 'Versatile scripting language, useful for automation and tool development.' 
  },
  { 
    name: 'Go (Golang)', 
    icon: <SiGo className="text-4xl sm:text-5xl text-blue-500" />, 
    description: 'Efficient language for backend systems and building scalable applications.' 
  },
];

const Skills = ({ darkMode }) => {
  const [showMore, setShowMore] = useState(false);
  const skillsRef = useRef(null);

  const scrollToSkills = () => {
    if (skillsRef.current) {
      skillsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Variants for animations
  const cardVariants = {
    hover: { scale: 1.05 },
  };

  return (
    <section
      id="skills"
      className={`py-12 ${
        darkMode
          ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white'
          : 'bg-gradient-to-b from-white via-gray-100 to-white text-black'
      }`}
      aria-labelledby="skills-heading"
    >
      <div className="container mx-auto text-center px-4">
        <h2
          id="skills-heading"
          className="text-3xl sm:text-4xl font-extrabold mb-10"
        >
          Skills
        </h2>

        {/* Desktop view */}
        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {essentialSkills.map((skill, index) => (
            <motion.div
              key={index}
              className={`rounded-lg p-6 flex flex-col items-center shadow-lg ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
              variants={cardVariants}
              whileHover="hover"
              aria-label={skill.name}
            >
              <div className="mb-4">{skill.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{skill.name}</h3>
              <p className="text-base text-center">{skill.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Mobile view */}
        <div className="block sm:hidden">
          <div className="grid grid-cols-1 gap-6" ref={skillsRef}>
            {essentialSkills.slice(0, 4).map((skill, index) => (
              <motion.div
                key={index}
                className={`rounded-lg p-4 flex flex-col items-center shadow-lg ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
                variants={cardVariants}
                whileHover="hover"
                aria-label={skill.name}
              >
                <div className="mb-3">{skill.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{skill.name}</h3>
                <p className="text-sm text-center">{skill.description}</p>
              </motion.div>
            ))}

            <AnimatePresence>
              {showMore &&
                essentialSkills.slice(4).map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`rounded-lg p-4 flex flex-col items-center shadow-lg ${
                      darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}
                    variants={cardVariants}
                    whileHover="hover"
                    aria-label={skill.name}
                  >
                    <div className="mb-3">{skill.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{skill.name}</h3>
                    <p className="text-sm text-center">{skill.description}</p>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>

          <div className="mt-8 text-center">
            {!showMore ? (
              <motion.button
                onClick={() => setShowMore(true)}
                className="px-6 py-3 text-sm font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md"
                whileTap={{ scale: 0.95 }}
              >
                See More
              </motion.button>
            ) : (
              <motion.button
                onClick={() => {
                  setShowMore(false);
                  scrollToSkills();
                }}
                className="px-6 py-3 text-sm font-semibold rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md"
                whileTap={{ scale: 0.95 }}
              >
                See Less
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
