import React, { useState, useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import ProjectCard from './ProjectComponents/ProjectCard';
import ProjectModal from './ProjectComponents/ProjectModal'
import AddProjectModal from './ProjectComponents/AddProjectModal';
import StudyGroupModal from './StudyGroupComponents/StudyGroupModal'; 
import AddStudyGroupModal from './StudyGroupComponents/AddStudyGroupModal';
import StudyGroupCard from './StudyGroupComponents/StudyGroupCard';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isGenerateQuestionsPage, setIsGenerateQuestionsPage] = useState(false);
    const [isStudyGroupModalOpen, setIsStudyGroupModalOpen] = useState(false);
    const [isAddStudyGroupModalOpen, setIsAddStudyGroupModalOpen] = useState(false);
    const [studyGroups, setStudyGroups] = useState([]);
    const [selectedStudyGroup, setSelectedStudyGroup] = useState(null);

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

    useEffect(() => {
        const fetchStudyGroups = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/studygroup/get', {
                    headers: { 'Authorization': localStorage.getItem('token') }
                });
                const data = await response.json();
                setStudyGroups(data);
            } catch (error) {
                console.error('Error fetching study groups:', error);
            }
        };
        fetchStudyGroups();
    }, []);

    const handleOpenModal = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const handleOpenAddModal = () => {
        setIsAddModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    };

    const handleOpenStudyGroupModal = (studyGroup) => {
        setSelectedStudyGroup(studyGroup);
        setIsStudyGroupModalOpen(true);
    };

    const handleOpenAddStudyGroupModal = () => {
        setIsAddStudyGroupModalOpen(true);
    };
    const handleCloseStudyGroupModal = () => {
        setIsStudyGroupModalOpen(false);
        setSelectedStudyGroup(null);
    };
    const handleCloseAddStudyGroupModal = () => {
        setIsAddStudyGroupModalOpen(false);
    };

    return (
        <div className="container mx-auto p-8">
            <h2 className="text-2xl font-bold mb-4">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border-dashed border-2 border-blue-500 flex items-center justify-center p-6 rounded-lg">
                    <button onClick={handleOpenAddModal} className="flex flex-col items-center text-blue-500 hover:text-blue-600">
                        <AiOutlinePlus size={40} />
                        <span className="mt-2">Add Project</span>
                    </button>
                </div>

                {projects.map((project) => (
                    <ProjectCard key={project._id} project={project} handleOpenModal={handleOpenModal} />
                ))}
            </div>

            <h2 className="text-2xl font-bold mb-4 mt-8">Study Groups</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Add StudyGroup button */}
                <div className="border-dashed border-2 border-blue-500 flex items-center justify-center p-6 rounded-lg">
                    <button onClick={handleOpenAddStudyGroupModal} className="flex flex-col items-center text-blue-500 hover:text-blue-600">
                        <AiOutlinePlus size={40} />
                        <span className="mt-2">Add Study Group</span>
                    </button>
                </div>

                {/* Render study groups */}
                {studyGroups.map((studyGroup) => (
                    <StudyGroupCard key={studyGroup._id} studyGroup={studyGroup} handleOpenModal={handleOpenStudyGroupModal} />
                ))}
            </div>

            {isModalOpen && selectedProject && (
                <ProjectModal
                    selectedProject={selectedProject}
                    handleCloseModal={handleCloseModal}
                    isGenerateQuestionsPage={isGenerateQuestionsPage}
                    setIsGenerateQuestionsPage={setIsGenerateQuestionsPage}
                />
            )}

            {isAddModalOpen && (
                <AddProjectModal handleCloseAddModal={handleCloseAddModal} setProjects={setProjects} projects={projects} />
            )}

            {isStudyGroupModalOpen && selectedStudyGroup && (
                <StudyGroupModal
                    selectedStudyGroup={selectedStudyGroup}
                    handleCloseModal={handleCloseStudyGroupModal}
                />
            )}

            {isAddStudyGroupModalOpen && (
                <AddStudyGroupModal handleCloseAddModal={handleCloseAddStudyGroupModal} setStudyGroups={setStudyGroups} studyGroups={studyGroups} />
            )}
        </div>
    );
};

export default Dashboard;
