import React, { useState } from 'react';

const GenerateQuestions = ({ setIsGenerateQuestionsPage, selectedProject }) => {
    const [questionFile, setQuestionFile] = useState(null);
    const [title, setTitle] = useState('');

    const handleFileChange = (e) => {
        setQuestionFile(e.target.files[0]);
    };

    const handleGenerateQuestions = async (e) => {
        e.preventDefault();
        if (!questionFile) {
            alert('Please upload a file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', questionFile);
        formData.append('project', selectedProject._id);
        formData.append('title', title);

        try {
            const response = await fetch(`http://localhost:8000/api/project/generateQuestions`, {
                method: 'POST',
                headers: { 'Authorization': localStorage.getItem('token') },
                body: formData,
            });

            if (response.ok) {
                alert('Questions generated successfully!');
                setIsGenerateQuestionsPage(false);
            } else {
                alert('Failed to generate questions.');
            }
        } catch (error) {
            console.error('Error generating questions:', error);
        }
    };

    return (
        <form onSubmit={handleGenerateQuestions} className="space-y-4">
            <h2 className="text-2xl font-bold">Generate Questions</h2>
            <div>
                <label htmlFor="title" className="block font-bold">Title:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2 w-full"
                />
            </div>
            <div>
                <label htmlFor="file" className="block font-bold">Upload Question File:</label>
                <input type="file" id="file" onChange={handleFileChange} className="border p-2 w-full" />
            </div>
            <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
                Generate
            </button>
            <button
                onClick={() => setIsGenerateQuestionsPage(false)}
                className="text-red-500 hover:underline"
            >
                Cancel
            </button>
        </form>
    );
};

export default GenerateQuestions;
