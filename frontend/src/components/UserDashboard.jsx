import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { TrashIcon } from '@heroicons/react/24/solid';

const UserDashboard = () => {
    const [fileFields, setFileFields] = useState([{ id: Date.now(), file: null, text: '' }]);
    const [uploadMessage, setUploadMessage] = useState('');
    const [showUploadSection, setShowUploadSection] = useState(false);
    const [isUploadSuccess, setIsUploadSuccess] = useState(false);
    const [additionalInfo, setAdditionalInfo] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const toggleUploadSection = () => {
        setShowUploadSection(true); // Show the form for new uploads
        setIsUploadSuccess(false); // Reset the success state
        setUploadMessage(''); // Clear any previous messages
    };

    const handleTextChange = (index, e) => {
        const updatedFields = fileFields.map((field, i) => i === index ? { ...field, text: e.target.value } : field);
        setFileFields(updatedFields);
    };

    const handleAddMore = () => setFileFields([...fileFields, { id: Date.now(), file: null, text: '' }]);

    const handleFileChange = (index, e) => {
        const file = e.target.files[0];
        const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
        const VALID_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

        if (!VALID_FILE_TYPES.includes(file.type)) {
            alert('Invalid file type. Only PDF, JPG, and PNG are allowed.');
            return;
        }
        
        if (file.size > MAX_FILE_SIZE) {
            alert('File size exceeds the maximum limit of 3MB.');
            return;
        }
        
        const updatedFields = fileFields.map((field, i) => i === index ? { ...field, file: file } : field);
        setFileFields(updatedFields);
    };

    const handleDeleteRow = (id) => setFileFields(fileFields.filter(field => field.id !== id));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const hasSelectedFiles = fileFields.some(field => field.file);
        if (!hasSelectedFiles) {
            setUploadMessage('Please select at least one file to upload.');
            return;
        }

        const formData = new FormData();
        fileFields.forEach((field) => {
            if (field.file) {
                formData.append('files', field.file);
            }
        });

        formData.append('titles', JSON.stringify(fileFields.map(field => field.text || 'No title')));
        formData.append('userId', user.id);
        formData.append('additionalInfo', additionalInfo);

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
                },
            });
            setUploadMessage(response.data.message);
            setIsUploadSuccess(true); // Update state to indicate success
            setFileFields([{ id: Date.now(), file: null, text: '' }]);
            setAdditionalInfo('');
            setShowUploadSection(false);

            // Clear the success message after 2 seconds
        setTimeout(() => {
            setUploadMessage('');
        }, 4000);

        } catch (error) {
            setUploadMessage('Failed to upload documents.');
            setIsUploadSuccess(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-800"> {user?.name}'s Dashboard <span className="mr-5">Welcome!</span></h1>
                {!isUploadSuccess && !showUploadSection && (
                    <button onClick={toggleUploadSection} className="px-4 py-2 text-sm font-medium bg-blue-500 hover:bg-blue-700 text-white rounded transition duration-150 ease-in-out">
                        Upload Document
                    </button>
                )}
            </div>
            
            {showUploadSection && (
                 <form onSubmit={handleSubmit} className="space-y-4">
                 {fileFields.map((field, index) => (
                     <div key={field.id} className="flex items-center space-x-3">
                         <input type="text" placeholder="Document Title" value={field.text} onChange={e => handleTextChange(index, e)} className="form-input flex-1 mt-2 px-4 py-2 border focus:outline-none focus:border-indigo-500 rounded-md border-gray-300 shadow-sm" />
                         <input type="file" onChange={e => handleFileChange(index, e)} className="form-file flex-1" accept=".pdf,.jpg,.jpeg,.png" />
                         <button type="button" onClick={() => handleDeleteRow(field.id)} className="p-2 bg-red-500 hover:bg-red-700 text-white rounded transition duration-150 ease-in-out">
                             <TrashIcon className="h-5 w-5" />
                         </button>
                     </div>
                 ))}
                 <h2 className="text-xl font-semibold text-gray-800"> Additional Information</h2>
                 <textarea
                        placeholder="Additional Information"
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                        className="form-textarea w-full mt-2 px-4 py-2 border focus:outline-none focus:border-indigo-500 rounded-md border-gray-300 shadow-sm"
                        rows="4"
                    ></textarea>
                 <div className="flex justify-between items-center">
                     <button type="button" onClick={handleAddMore} className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white font-medium rounded transition duration-150 ease-in-out">Add More document</button>
                     <button type="submit" className="px-6 py-2 bg-blue-500 hover:bg-blue-700 text-white font-medium rounded transition duration-150 ease-in-out">Submit</button>
                 </div>
             </form>
            )}

            {/* If files are uploaded successfully, show the 'Add Document' button and success message */}
            {!showUploadSection && isUploadSuccess && (
                <div>
                    <button onClick={toggleUploadSection} className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white font-medium rounded transition duration-150 ease-in-out">Add Document</button>
                    {uploadMessage && (
      <div className="text-center text-sm font-medium p-2 rounded bg-green-100 text-green-700 transition-opacity duration-500 ease-in-out">
        {uploadMessage}
      </div>
    )}
                </div>
            )}

            {/* Show an error message if there are no files selected when the user tries to submit */}
            {!isUploadSuccess && uploadMessage && (
                <div className="text-center text-sm font-medium p-2 rounded bg-red-100 text-red-700">{uploadMessage}</div>
            )}
        </div>
    );
};

export default UserDashboard;