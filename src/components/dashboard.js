import React, { useState, useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMember, setNewMember] = useState('');
  const [members, setMembers] = useState([]); // For tracking members added to a project
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    studygroup: '',
    emailFrequency: 'Daily' // Default to "Daily"
  });

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
  const handleAddMember = () => {
    if (newMember) {
      setMembers([...members, newMember]);
      setNewMember('');
    }
  };

  // Handle Generate Questions
  const handleGenerateQuestions = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/project/generateQuestions`, {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ project: selectedProject._id, title: selectedProject.name })
      });

      if (response.ok) {
        alert('Questions generated successfully!');
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
            <h2 className="text-2xl font-bold mb-4">{selectedProject.name}</h2>
            <p className="mb-2"><strong>Description:</strong> {selectedProject.description}</p>
            <p className="mb-2"><strong>Study Group:</strong> {selectedProject.studygroup}</p>
            <p className="mb-4"><strong>Email Frequency:</strong> {selectedProject.emailFrequency}</p>

            {/* Add Members Section */}
            <div className="mb-4">
              <h3 className="font-bold">Add Members:</h3>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  placeholder="Enter member's name or email"
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
                  <li key={index}>{member}</li>
                ))}
              </ul>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleGenerateQuestions}
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
