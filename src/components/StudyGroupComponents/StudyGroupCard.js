import React from 'react';

const StudyGroupCard = ({ studyGroup, handleOpenModal }) => {
    return (
        <div
            onClick={() => handleOpenModal(studyGroup)}
            className="border p-4 rounded-lg shadow-md bg-white hover:bg-gray-100 cursor-pointer"
        >
            <h3 className="text-lg font-semibold">{studyGroup.name}</h3>
            <p className="text-sm text-gray-600">Members: {studyGroup.members.length} </p>
        </div>
    );
};

export default StudyGroupCard;