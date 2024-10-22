import React from 'react';

const AddMembersStudyGroup = ({ members, newMemberName, newMemberEmail, setNewMemberName, setNewMemberEmail, handleAddMember }) => {
    return (
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
                    <li key={index}>{member.name} ({member.email})</li>
                ))}
            </ul>
        </div>
    );
};

export default AddMembersStudyGroup;
