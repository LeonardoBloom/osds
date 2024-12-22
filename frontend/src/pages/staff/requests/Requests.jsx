import React, { useState } from 'react';

const Requests = ({ requests }) => {
  // State to store the text input for each request
  const [textInput, setTextInput] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Handle text input change
  const handleTextInputChange = (event, req_id) => {
    const inputText = event.target.value;
    setTextInput(inputText); // Store the text input
    setSelectedRequest(req_id); // Track which request the text input belongs to
  };

  // Handle form submission to send data (including text input) to the database
  const handleSubmit = async (req_id) => {
    if (!textInput) {
      alert('Please enter the required text before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('doc', textInput); // Append the text input to the form data
    formData.append('req', req_id); // Append the request ID
    
    console.log("Submitting: ", formData);

    try {
      const response = await fetch(`http://localhost:5000/api/upload/doc/${req_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({
            doc: textInput,
            req_id: req_id
        }),
      });

      if (response.ok) {
        alert('Document information submitted successfully!');
        // You can trigger some update here if needed, such as fetching updated data
      } else {
        alert('Failed to submit the document information');
      }
    } catch (error) {
      console.error('Error submitting document:', error);
      alert('An error occurred while submitting the document information.');
    }
  };

  // Handle invoice text input change
  const handleInvoiceInputChange = (event, req_id) => {
    const inputText = event.target.value;
    setTextInput(inputText); // Store the invoice text input
    setSelectedRequest(req_id); // Track which request the invoice belongs to
  };

  const handleInvoiceSubmit = async (req_id) => {
    if (!textInput) {
      alert('Please enter the invoice information before submitting.');
      return;
    }

    const formData = new FormData();
  formData.append('invoice', textInput); // Use 'invoice' as the key
  let invoice = textInput

  try {
    console.log("Submitting: ", req_id, " ", textInput);
    const response = await fetch(`http://localhost:5000/api/upload/invoice/${req_id}`, { // Changed the URL to match the correct endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ invoice: textInput })
    });

    if (response.ok) {
      alert('Document information submitted successfully!');
      // Trigger some update here if needed
    } else {
      alert('Failed to submit the document information');
    }
  } catch (error) {
    console.error('Error submitting document:', error);
    alert('An error occurred while submitting the document information.');
  }
};

  return (
    <div className="requests-table-container">
      <h1>REQUESTS</h1>
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Request #</th>
            <th className="border p-2">Request Type</th>
            <th className="border p-2">Student #</th>
            <th className="border p-2">Completed</th>
            <th className="border p-2">Enter Document Info</th>
            <th className="border p-2">Enter Invoice Info</th>
            <th className="border p-2">Receipt</th>
            <th className="border p-2">SEND?</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request, index) => (
            <tr key={index}>
              <td className="border p-2">{request.req_id}</td>
              <td className="border p-2">{request.req_type}</td>
              <td className="border p-2">{request.stu_id}</td>
              <td className="border p-2">{request.completed ? 'Yes' : 'No'}</td>
              <td className="border p-2">
                {request.document ? (
                  'Document Info Submitted'
                ) : (
                  <input
                    type="text"
                    placeholder="Enter document info"
                    onChange={(e) => handleTextInputChange(e, request.req_id)}
                  />
                )}
              </td>
              <td className="border p-2">
                {request.invoice ? (
                  'Invoice Info Submitted'
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Enter invoice info"
                      onChange={(e) => handleInvoiceInputChange(e, request.req_id)}
                    />
                    <button
                      onClick={() => handleInvoiceSubmit(request.req_id)}
                      disabled={!textInput || selectedRequest !== request.req_id}
                    >
                      Submit Invoice Info
                    </button>
                  </>
                )}
              </td>
              <td className="border p-2">
                {request.pay_receipt ? 'Receipt Available' : 'No Receipt'}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleSubmit(request.req_id)}
                  disabled={!textInput || selectedRequest !== request.req_id}
                >
                  SEND
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Requests;
