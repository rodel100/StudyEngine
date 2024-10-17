import React, { useState, useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [members, setMembers] = useState([]);
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        studygroup: '',
        emailFrequency: 'Daily' // Default to "Daily"
    });
    const [isGenerateQuestionsPage, setIsGenerateQuestionsPage] = useState(false);
    const [questionFile, setQuestionFile] = useState(null);

    // Fetch existing projects
    useEffect(() => {
        const fetchProjects = async () => {
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

        fetchProjects();
    }, []);

    // Open modal with project details
    const handleOpenModal = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    // Open Add Project modal
    const handleOpenAddModal = () => {
        setIsAddModalOpen(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
    };

    // Close Add Project modal
    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    };

    // Handle form change for new project
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProject((prevProject) => ({
            ...prevProject,
            [name]: value
        }));
    };

    // Handle Add Project submission
    const handleAddProject = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/project/create', {
                method: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProject)
            });

            if (response.ok) {
                const createdProject = await response.json();
                setProjects([...projects, createdProject]); // Add new project to the list
                alert('Project added successfully!');
                handleCloseAddModal(); // Close the modal after successful creation
            } else {
                alert('Failed to add project.');
            }
        } catch (error) {
            console.error('Error adding project:', error);
        }
    };

    // Handle adding new member to the selected project
    const handleAddMember = async () => {
        if (newMemberName && newMemberEmail && selectedProject) {
            const newMember = {
                Name: newMemberName,
                Email: newMemberEmail
            };

            try {
                const response = await fetch(`http://localhost:8000/api/project/addmembers/${selectedProject._id}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': localStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ members: [newMember] }) // Send new member in request body as an array
                });

                if (response.ok) {
                    const updatedProject = await response.json();
                    setMembers([...members, newMember]); // Update local members state
                    setNewMemberName(''); // Clear input fields
                    setNewMemberEmail('');
                    alert('Member added successfully!');
                } else {
                    alert('Failed to add member.');
                }
            } catch (error) {
                console.error('Error adding member:', error);
            }
        } else {
            alert('Please provide both a name and an email.');
        }
    };

    // Handle Generate Questions
    const handleGenerateQuestions = async (e) => {
        e.preventDefault();
        if (!questionFile) {
            alert('Please upload a file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', questionFile);
        formData.append('project', selectedProject._id);
        formData.append('title', selectedProject.name);

        try {
            const response = await fetch(`http://localhost:8000/api/project/generateQuestions`, {
                method: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('token'),
                },
                body: formData
            });

            if (response.ok) {
                alert('Questions generated successfully!');
                setIsGenerateQuestionsPage(false); // Go back to project details
            } else {
                alert('Failed to generate questions.');
            }
        } catch (error) {
            console.error('Error generating questions:', error);
        }
    };

    // Handle Start Sending Emails
    const handleSendEmails = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/project/sendEmails/${selectedProject._id}`, {
                method: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });

            if (response.ok) {
                alert('Emails sent successfully!');
            } else {
                alert('Failed to send emails.');
            }
        } catch (error) {
            console.error('Error sending emails:', error);
        }
    };
    const handleFileChange = (e) => {
        setQuestionFile(e.target.files[0]);
    };

    return (
        <div className="container mx-auto p-8">
            {/* Add Project Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Add a New Project</h2>
            </div>

            {/* Projects Section */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Current Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Add Project Button */}
                    <div className="border-dashed border-2 border-blue-500 flex items-center justify-center p-6 rounded-lg">
                        <button
                            onClick={handleOpenAddModal}
                            className="flex flex-col items-center text-blue-500 hover:text-blue-600"
                        >
                            <AiOutlinePlus size={40} />
                            <span className="mt-2">Add Project</span>
                        </button>
                    </div>

                    {/* Project Cards */}
                    {projects.map((project) => (
                        <div
                            key={project._id}
                            onClick={() => handleOpenModal(project)}
                            className="border p-4 rounded-lg shadow-md bg-white hover:bg-gray-100 cursor-pointer"
                        >
                            <h3 className="text-lg font-semibold">{project.name}</h3>
                            <p className="text-sm text-gray-600">{project.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Project Modal */}
            {isModalOpen && selectedProject && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        {!isGenerateQuestionsPage ? (
                            <>
                                <h2 className="text-2xl font-bold mb-4">{selectedProject.name}</h2>
                                <p className="mb-2"><strong>Description:</strong> {selectedProject.description}</p>
                                <p className="mb-2"><strong>Study Group:</strong> {selectedProject.studygroup}</p>
                                <p className="mb-4"><strong>Email Frequency:</strong> {selectedProject.emailFrequency}</p>
                                <p className="mb-4"><strong>Members:</strong></p>
                                <ul className="list-disc pl-5">
                                    {selectedProject.members.map((member, index) => (
                                        <li key={index}>{member.Name} ({member.Email})<button>Remove Member</button></li>
                                    ))}
                                </ul>
                                {/* Add Members Section */}
                                <div className="mb-4">
                                    <h3 className="font-bold">Add Members:</h3>
                                    <div className="flex flex-col space-y-2 mb-2">
                                        <input
                                            type="text"
                                            value={newMemberName}
                                            onChange={(e) => setNewMemberName(e.target.value)}
                                            placeholder="Enter member's name"
                                            className="border p-2 flex-1 rounded"
                                        />
                                        <input
                                            type="email"
                                            value={newMemberEmail}
                                            onChange={(e) => setNewMemberEmail(e.target.value)}
                                            placeholder="Enter member's email"
                                            className="border p-2 flex-1 rounded"
                                        />
                                        <button
                                            onClick={handleAddMember}
                                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <ul className="list-disc pl-5">
                                        {members.map((member, index) => (
                                            <li key={index}>{member.Name} ({member.Email})</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => setIsGenerateQuestionsPage(true)} // Open the Generate Questions page
                                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                    >
                                        Generate Questions
                                    </button>
                                    <button
                                        onClick={handleSendEmails}
                                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                                    >
                                        Start Sending Emails
                                    </button>
                                </div>

                                <button
                                    onClick={handleCloseModal}
                                    className="mt-4 text-red-500 hover:underline"
                                >
                                    Close
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="mb-4">
                                    <button
                                        onClick={() => setIsGenerateQuestionsPage(false)}
                                        className="text-blue-500 hover:underline"
                                    >
                                        &larr; Back to Project Details
                                    </button>
                                </div>
                                <h2 className="text-2xl font-bold mb-4">Generate Questions for {selectedProject.name}</h2>
                                <form onSubmit={handleGenerateQuestions}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-bold mb-2">Upload Questions File</label>
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={handleFileChange}
                                            required
                                            className="border p-2 rounded w-full"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                    >
                                        Execute
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Add Project Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
                        <form onSubmit={handleAddProject} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">Project Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newProject.name}
                                    onChange={handleInputChange}
                                    required
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={newProject.description}
                                    onChange={handleInputChange}
                                    required
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Study Group</label>
                                <input
                                    type="text"
                                    name="studygroup"
                                    value={newProject.studygroup}
                                    onChange={handleInputChange}
                                    required
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Email Frequency</label>
                                <select
                                    name="emailFrequency"
                                    value={newProject.emailFrequency}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded w-full"
                                >
                                    <option value="Daily">Daily</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Biweekly">Biweekly</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                >
                                    Add Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
