import React, { useState } from 'react';
import AddMembersSection from './AddMembers';
import GenerateQuestionsForm from './GenerateQuestions';

const ProjectModal = ({ selectedProject, handleCloseModal, isGenerateQuestionsPage, setIsGenerateQuestionsPage }) => {
    const [members, setMembers] = useState([]);
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberEmail, setNewMemberEmail] = useState('');

    const handleAddMember = async () => {
        if (newMemberName && newMemberEmail) {
            const newMember = { Name: newMemberName, Email: newMemberEmail };
            try {
                const response = await fetch(`http://localhost:8000/api/project/addmembers/${selectedProject._id}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': localStorage.getItem('token'),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ members: [newMember] }),
                });

                if (response.ok) {
                    setMembers([...members, newMember]);
                    setNewMemberName('');
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
    const handleSendEmails = async () => {
        try {
            console.log(selectedProject._id);
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
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                {!isGenerateQuestionsPage ? (
                    <>
                        <h2 className="text-2xl font-bold mb-4">{selectedProject.name}</h2>
                        <p><strong>Description:</strong> {selectedProject.description}</p>
                        <p><strong>Study Group:</strong> {selectedProject.studygroup}</p>
                        <p><strong>Email Frequency:</strong> {selectedProject.emailFrequency}</p>
                        <AddMembersSection
                            members={members}
                            newMemberName={newMemberName}
                            newMemberEmail={newMemberEmail}
                            setNewMemberName={setNewMemberName}
                            setNewMemberEmail={setNewMemberEmail}
                            handleAddMember={handleAddMember}
                        />
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setIsGenerateQuestionsPage(true)}
                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                            >
                                Generate Questions
                            </button>
                            <button
                                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                             onClick={handleSendEmails}>
                                Start Sending Emails
                            </button>
                        </div>
                        <button onClick={handleCloseModal} className="mt-4 text-red-500 hover:underline">Close</button>
                    </>
                ) : (
                    <GenerateQuestionsForm setIsGenerateQuestionsPage={setIsGenerateQuestionsPage} selectedProject={selectedProject} />
                )}
            </div>
        </div>
    );
};

export default ProjectModal;
