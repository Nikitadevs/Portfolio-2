// Import necessary dependencies
import React, { useState, useRef, useMemo } from 'react';
import {
  FaDocker,
  FaAws,
  FaGitAlt,
  FaPython,
  FaLinux,
  FaJenkins,
} from 'react-icons/fa';
import {
  SiKubernetes,
  SiAnsible,
  SiTerraform,
  SiGo,
} from 'react-icons/si';
import { motion, AnimatePresence } from 'framer-motion';

// Define the SkillCard component with enhanced visuals
const SkillCard = React.memo(({ skill, darkMode }) => {
  return (
    <motion.div
      className={`rounded-lg p-6 flex flex-col items-center transition-all duration-300 
                  shadow-md hover:shadow-xl hover:scale-105 
                  ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
      role="button"
      tabIndex={0}
      aria-label={skill.name}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          // Define any onClick behavior if needed
        }
      }}
    >
      <div className="mb-4">{skill.icon}</div>
      <h3 className="text-xl font-semibold mb-2">{skill.name}</h3>
      <p className="text-base text-center">{skill.description}</p>
    </motion.div>
  );
});

// Define the main Skills component with visual enhancements
const Skills = ({ darkMode }) => {
  const [showMore, setShowMore] = useState(false);
  const skillsRef = useRef(null); // Reference to the entire skills section

  // Memoize the skills data
  const essentialSkills = useMemo(() => [
    { 
      name: 'Docker', 
      icon: <FaDocker className="text-5xl text-blue-500" />, 
      description: 'Platform for containerizing applications, essential for modern DevOps practices.' 
    },
    { 
      name: 'Kubernetes', 
      icon: <SiKubernetes className="text-5xl text-blue-500" />, 
      description: 'System for automating deployment, scaling, and management of containerized applications.' 
    },
    { 
      name: 'AWS', 
      icon: <FaAws className="text-5xl text-orange-500" />, 
      description: 'Comprehensive cloud services platform, crucial for cloud infrastructure management.' 
    },
    { 
      name: 'Git', 
      icon: <FaGitAlt className="text-5xl text-red-500" />, 
      description: 'Version control system for tracking changes in code and facilitating collaboration.' 
    },
    { 
      name: 'Linux', 
      icon: <FaLinux className="text-5xl text-green-500" />, 
      description: 'Operating system widely used in server environments, essential for server management.' 
    },
    { 
      name: 'Jenkins', 
      icon: <FaJenkins className="text-5xl text-gray-500" />, 
      description: 'Automation server for continuous integration and delivery pipelines.' 
    },
    { 
      name: 'Ansible', 
      icon: <SiAnsible className="text-5xl text-red-500" />, 
      description: 'Tool for configuration management and automation, important for infrastructure as code.' 
    },
    { 
      name: 'Terraform', 
      icon: <SiTerraform className="text-5xl text-purple-500" />, 
      description: 'Infrastructure as code tool for provisioning and managing cloud infrastructure.' 
    },
    { 
      name: 'Python', 
      icon: <FaPython className="text-5xl text-yellow-500" />, 
      description: 'Versatile scripting language, useful for automation and tool development.' 
    },
    { 
      name: 'Go (Golang)', 
      icon: <SiGo className="text-5xl text-blue-500" />, 
      description: 'Efficient language for backend systems and building scalable applications.' 
    },
  ], []);

  // Scroll to skills section
  const scrollToSkills = () => {
    if (skillsRef.current) {
      skillsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="skills"
      className={`py-12 transition-colors duration-500
                  ${darkMode
                    ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white'
                    : 'bg-gradient-to-b from-white via-gray-100 to-white text-black'}`}
      aria-labelledby="skills-heading"
      ref={skillsRef}
    >
      <div className="container mx-auto text-center px-4">
        <h2
          id="skills-heading"
          className="text-4xl sm:text-5xl font-extrabold mb-10 border-b pb-4"
        >
          Skills
        </h2>

        {/* Desktop view */}
        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {essentialSkills.map((skill) => (
            <SkillCard key={skill.name} skill={skill} darkMode={darkMode} />
          ))}
        </div>

        {/* Mobile view */}
        <div className="block sm:hidden">
          <div className="grid grid-cols-1 gap-6">
            {essentialSkills.slice(0, 4).map((skill) => (
              <SkillCard key={skill.name} skill={skill} darkMode={darkMode} />
            ))}

            <AnimatePresence>
              {showMore &&
                essentialSkills.slice(4).map((skill) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SkillCard skill={skill} darkMode={darkMode} />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>

          <div className="mt-8 text-center">
            <motion.button
              onClick={() => {
                if (showMore) {
                  setShowMore(false);
                  setTimeout(() => {
                    scrollToSkills();
                  }, 300);
                } else {
                  setShowMore(true);
                }
              }}
              className={`px-6 py-3 text-sm font-semibold rounded-full shadow-md transition-colors 
                          focus:outline-none focus:ring-4
                          ${showMore
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              aria-expanded={showMore}
              aria-controls="additional-skills"
            >
              {showMore ? 'See Less' : 'See More'}
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
