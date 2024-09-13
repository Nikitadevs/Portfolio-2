// Projects.jsx
import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import ProjectModal from './ProjectModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

// Define projects with unique IDs
const projects = [
  {
    id: 'cicd-pipeline',
    title: 'Automated CI/CD Pipeline',
    description:
      'Automated the build, test, and deployment process for a microservices architecture using Jenkins and Docker. Set up a CI/CD pipeline to deploy updates seamlessly.',
    image: 'https://via.placeholder.com/400x200',
    // Removed 'link' since "View Live" is no longer needed
    codeLink: 'https://github.com/example/cicd-project',
    technologies: ['Jenkins', 'Docker', 'Kubernetes', 'Git', 'Terraform'],
  },
  {
    id: 'terraform-infrastructure',
    title: 'Infrastructure Provisioning with Terraform',
    description:
      'Provisioned cloud resources using Terraform to create an auto-scaling, fault-tolerant infrastructure on AWS, including EC2, S3, and RDS.',
    image: 'https://via.placeholder.com/400x200',
    codeLink: 'https://github.com/example/terraform-project',
    technologies: ['Terraform', 'AWS', 'EC2', 'S3', 'RDS'],
  },
  {
    id: 'kubernetes-monitoring',
    title: 'Kubernetes Monitoring Setup',
    description:
      'Set up real-time monitoring and alerting for a Kubernetes cluster using Prometheus and Grafana. Created dashboards for visualizing resource utilization and system health.',
    image: 'https://via.placeholder.com/400x200',
    codeLink: 'https://github.com/example/monitoring-project',
    technologies: ['Kubernetes', 'Prometheus', 'Grafana', 'Docker', 'Linux'],
  },
];

// Memoized ProjectCard to prevent unnecessary re-renders
// eslint-disable-next-line react/display-name
const ProjectCard = memo(({ project, darkMode, onClick }) => {
  const { title, description, image } = project;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`flex flex-col h-full rounded-lg overflow-hidden transition-transform hover:shadow-2xl relative ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyPress={(e) => {
        if (e.key === 'Enter') onClick();
      }}
      aria-label={`View details of ${title}`}
    >
      <div className="relative">
        <img
          src={image}
          alt={`Screenshot of ${title}`}
          className="w-full h-40 sm:h-56 object-cover"
          loading="lazy"
          srcSet={`${image} 400w, ${image} 800w`}
          sizes="(max-width: 640px) 100vw, 400px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white">{title}</h3>
        </div>
      </div>
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        <p className="text-sm sm:text-base mb-4 flex-1">{description}</p>
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 space-y-3 sm:space-y-0">
          {/* Prevent card onClick when button is clicked */}
          <button
            className={`w-full sm:w-auto px-4 py-2 text-sm sm:text-base font-semibold rounded-full shadow-md transition-all duration-300 ${
              darkMode
                ? 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-300'
                : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-200'
            } text-white focus:outline-none focus:ring-4`}
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering card's onClick
              onClick();
            }}
            aria-label={`View details of ${title}`}
          >
            View Project
          </button>
          {/* Removed the "Live Demo" link since it's no longer needed */}
          {project.codeLink && (
            <a
              href={project.codeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full sm:w-auto text-center text-green-500 hover:text-green-600 transition duration-300 focus:outline-none"
              aria-label={`View ${title} code in a new tab`}
              onClick={(e) => e.stopPropagation()} // Prevent triggering card's onClick
            >
              <span className="mr-1 text-sm sm:text-base">View Code</span>
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
});

ProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    // Removed 'link' since "View Live" is no longer used
    codeLink: PropTypes.string,
    technologies: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  darkMode: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const Projects = ({ darkMode }) => {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <motion.section
      id="projects"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`p-4 sm:p-8 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'
      }`}
    >
      <div className="container mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">DevOps Projects</h2>
        <p className="text-base sm:text-lg mb-8 sm:mb-10 max-w-3xl mx-auto">
          Here are some of the DevOps-related projects I have worked on. Each project highlights
          my experience with CI/CD pipelines, cloud infrastructure, and monitoring tools.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              darkMode={darkMode}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </div>
      {selectedProject && (
        <ProjectModal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          project={selectedProject}
          darkMode={darkMode}
        />
      )}
    </motion.section>
  );
};

Projects.propTypes = {
  darkMode: PropTypes.bool.isRequired,
};

export default Projects;
