import React, { useState, useEffect } from 'react';

const AddStudyGroupModal = ({ handleCloseAddModal, setStudyGroups, studyGroups }) => {
    const [newStudyGroupName, setNewStudyGroupName] = useState('');
    const [newStudyGroupProjects, setNewStudyGroupProjects] = useState([]);
    const [projects, setProjects] = useState([]);

    const handleAddStudyGroup = async () => {
        if (newStudyGroupName && newStudyGroupProjects.length > 0) {
            const newStudyGroup = {
                name: newStudyGroupName,
                projects: newStudyGroupProjects
            };
            try {
                const response = await fetch('http://localhost:8000/api/studygroup/create', {
                    method: 'POST',
                    headers: {
                        'Authorization': localStorage.getItem('token'),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({name: newStudyGroup.name, projects: newStudyGroup.projects}),
                });

                if (response.ok) {
                    const addedStudyGroup = await response.json();
                    setStudyGroups([...studyGroups, addedStudyGroup]);
                    setNewStudyGroupName('');
                    setNewStudyGroupProjects([]);
                    handleCloseAddModal();
                    alert('Study Group added successfully!');
                } else {
                    alert('Failed to add Study Group.');
                }
            } catch (error) {
                console.error('Error adding Study Group:', error);
            }
        } else {
            alert('Please provide both a Study Group name and select at least one project.');
        }
    };

    const handleGetProjects = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/project/get', {
                headers: { 'Authorization': localStorage.getItem('token') }
            });
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    // Handle selecting multiple projects
    const handleSelectProjects = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        setNewStudyGroupProjects(selectedOptions);
    };

    useEffect(() => {
        handleGetProjects();
    }, []);

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Add Study Group</h2>
                <input
                    type="text"
                    value={newStudyGroupName}
                    onChange={(e) => setNewStudyGroupName(e.target.value)}
                    placeholder="Enter Study Group name"
                    className="border p-2 mb-4 w-full rounded"
                />
                <select
                    multiple
                    value={newStudyGroupProjects}
                    onChange={handleSelectProjects}
                    className="border p-2 mb-4 w-full rounded h-32"
                >
                    <option value="" disabled>Select Projects</option>
                    {projects.map((project) => (
                        <option key={project._id} value={project._id}>
                            {project.name}
                        </option>
                    ))}
                </select>
                <div className="flex justify-between">
                    <button
                        onClick={handleAddStudyGroup}
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

export default AddStudyGroupModal;
