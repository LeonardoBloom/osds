import React, { useState } from 'react';

const StudentRequests = ({ stu_id }) => {
    const [requestType, setRequestType] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        if (!requestType) {
            setMessage('Please select a request type.');
            return;
        }

        try {
            setLoading(true);

            const response = await fetch('http://localhost:5000/api/student/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    stu_id,
                    requestType,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage('Request submitted successfully.');
            } else {
                setMessage(result.error || 'An error occurred.');
            }
        } catch (error) {
            setMessage('Failed to submit the request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="student-requests">
            <h2>Submit Request</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="requestType">Request Type:</label>
                    <select
                        id="requestType"
                        value={requestType}
                        onChange={(e) => setRequestType(e.target.value)}
                    >
                        <option value="">-- Select Request Type --</option>
                        <option value="Transcript">Transcript</option>
                        <option value="Certificate">Certificate</option>
                    </select>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default StudentRequests;
