import React, { useState } from 'react';
import AddMembersStudyGroup from './AddStudyGroupMembers'; // Ensure this component is implemented

const StudyGroupModal = ({ selectedStudyGroup, handleCloseModal }) => {
    const [members, setMembers] = useState([]);
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberEmail, setNewMemberEmail] = useState('');

    const handleAddMember = async () => {
        if (newMemberName && newMemberEmail) {
            const newMember = { name: newMemberName, email: newMemberEmail }; // Use lowercase keys for consistency
            try {
                const response = await fetch(`http://localhost:8000/api/studygroup/addmember/${selectedStudyGroup._id}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': localStorage.getItem('token'),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({  name: newMemberName, email: newMemberEmail }),
                });
                if (response.ok) {
                    setMembers((prevMembers) => [...prevMembers, newMember]);
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
            const response = await fetch(`http://localhost:8000/api/studygroup/sendemails/${selectedStudyGroup._id}`, {
                method: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ members }),
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
                <h2 className="text-2xl font-bold mb-4">{selectedStudyGroup.name}</h2>
                <p><strong>Description:</strong> {selectedStudyGroup.description}</p>
                <p><strong>Email Frequency:</strong> {selectedStudyGroup.emailFrequency}</p>
                <AddMembersStudyGroup
                    members={members}
                    newMemberName={newMemberName}
                    newMemberEmail={newMemberEmail}
                    setNewMemberName={setNewMemberName}
                    setNewMemberEmail={setNewMemberEmail}
                    handleAddMember={handleAddMember}
                />
                <div className="flex space-x-4">
                    <button
                        onClick={handleSendEmails}
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    >
                        Send Emails
                    </button>
                </div>
                <button onClick={handleCloseModal} className="mt-4 text-red-500 hover:underline">Close</button>
            </div>
        </div>
    );
};

export default StudyGroupModal;
