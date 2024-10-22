import React, { useState } from 'react';

const AddProjectModal = ({ handleCloseAddModal, setProjects, projects }) => {
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');

    const handleAddProject = async () => {
        if (newProjectName && newProjectDescription) {
            const newProject = {
                name: newProjectName,
                description: newProjectDescription,
            };
            try {
                const response = await fetch('http://localhost:8000/api/project/create', {
                    method: 'POST',
                    headers: {
                        'Authorization': localStorage.getItem('token'),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newProject),
                });

                if (response.ok) {
                    const addedProject = await response.json();
                    setProjects([...projects, addedProject]);
                    setNewProjectName('');
                    setNewProjectDescription('');
                    handleCloseAddModal();
                    alert('Project added successfully!');
                } else {
                    alert('Failed to add project.');
                }
            } catch (error) {
                console.error('Error adding project:', error);
            }
        } else {
            alert('Please provide both a project name and description.');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Add Project</h2>
                <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Enter project name"
                    className="border p-2 mb-4 w-full rounded"
                />
                <textarea
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="Enter project description"
                    className="border p-2 mb-4 w-full rounded"
                ></textarea>
                <div className="flex justify-between">
                    <button
                        onClick={handleAddProject}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Add
                    </button>
                    <button
                        onClick={handleCloseAddModal}
                        className="text-red-500 hover:underline"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProjectModal;
