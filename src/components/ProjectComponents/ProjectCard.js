import React from 'react';

const ProjectCard = ({ project, handleOpenModal }) => {
    return (
        <div
            onClick={() => handleOpenModal(project)}
            className="border p-4 rounded-lg shadow-md bg-white hover:bg-gray-100 cursor-pointer"
        >
            <h3 className="text-lg font-semibold">{project.name}</h3>
            <p className="text-sm text-gray-600">{project.description}</p>
        </div>
    );
};

export default ProjectCard;
