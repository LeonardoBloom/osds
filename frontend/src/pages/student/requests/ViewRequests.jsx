import React, { useState, useEffect } from 'react';
import './ViewRequests.css'; // You can import the CSS file for styling
import globalURL from '../../../globalURL';

const ViewRequests = ({ stu_id }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [invoiceRSA, setInvoiceRSA] = useState(false)
    const [docRSA, setDocRSA] = useState(false)
    const [pubKey, setPubKey] = useState(false)

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch(`http://${globalURL()}:5000/api/staff/requests/${stu_id}`);
                const data = await response.json();
                if (response.ok) {
                    setRequests(data);
                } else {
                    setError(data.error || 'Failed to fetch requests.');
                }
            } catch (err) {
                setError('An error occurred while fetching requests.');
            } finally {
                setLoading(false);
            }
        };

        const fetchPubKey = async () => {
            
                const response = await fetch(`http://${globalURL()}:5000/api/keys/rsa/pubkey`)
                const data = await response.json()

                setPubKey(data[0].key_pub)
            
        }

        fetchRequests();
        fetchPubKey()
    }, [stu_id]);

    const RSAcheck = async (mode, data, signature, pubKey) => {

        console.log("data to send",data)
        console.log("signature", signature)
        console.log("pubkey", pubKey)
        try {
            const response = await fetch(`http://${globalURL()}:5000/api/upload/verify?data=${encodeURIComponent(data)}&signature=${encodeURIComponent(signature)}&pubKey=${encodeURIComponent(pubKey)}`, {
                method: 'GET',
            });
    
            if (response.ok) {

                if(mode == "i") {
                    const invoiceCheck = await response.json(); // Assuming the response is a boolean (true or false)
                    console.log("invoice check: ", invoiceCheck);
        
                    // Set state based on the response
                    setInvoiceRSA(invoiceCheck); // This will set the value based on the response
                } else {
                    const documentCheck = await response.json(); // Assuming the response is a boolean (true or false)
                    console.log("document check: ", documentCheck);
        
                    // Set state based on the response

                    setDocRSA(documentCheck); // This will set the value based on the response
                }
                
    
            } else {
                if(mode == "i") {
                console.error("Failed to verify the invoice");
                setInvoiceRSA(false); // Default to false if verification fails
                } else {
                    console.error("Failed to verify the document");
                    setDocRSA(false); // Default to false if verification fails
                }
            }
        } catch (error) {
            if(mode == "i") {
            console.error("Error during verification: ", error);
            setInvoiceRSA(false); // Default to false in case of an error
            } else {
                console.error("Error during verification: ", error);
                setDocRSA(false); // Default to false in case of an error
            }
        }
    };
    

    const handleUploadReceipt = async (requestId) => {
        console.log(`Upload receipt for request ID: ${requestId}`);
        const response = await fetch(`http://${globalURL()}:5000/api/upload/receipt/${requestId}`)
        .then((response) => response.ok ? console.log("receipt uploaded"): console.log("failed receipt upload") )



    };

    const handleDownloadDocument = (requestId) => {
        console.log(`Download document for request ID: ${requestId}`);
    };

    const handleDownloadInvoice = (requestId) => {
        console.log(`Download invoice for INVOICE ID: ${requestId}`);
    };

    const formatTimestamp = (timestamp) => {
        return new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(new Date(timestamp));
    };

    if (loading) return <p>Loading requests...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="view-requests">
            <h2>Your Requests</h2>
            {requests.length === 0 ? (
                <p>No requests found.</p>
            ) : (
                <ul className="request-list">
                    {requests.map((request) => (
                        <li key={request.req_id} className="request-item">
                            <div className="request-details">
                                <p><strong>Request ID:</strong> {request.req_id}</p>
                                <p><strong>Request Type:</strong> {request.req_type}</p>
                                <p><strong>Timestamp:</strong> {formatTimestamp(request.req_date)}</p>
                            </div>

                            <div className="request-status">
                                {request.completed ? (
                                    <>
                                        <p>
                                            <strong onClick={() => RSAcheck("d", request.document, request.doc_rsa, pubKey)}>Status:</strong>
                                            <span
                                                style={{
                                                    color: docRSA ? 'green' : 'red',
                                                }}
                                            >
                                                {docRSA ? 'RSA Signed' : 'Not RSA Signed'}
                                            </span>
                                        </p>
                                        <button onClick={() => handleDownloadDocument(request.req_id)}>
                                            Download Document
                                        </button>
                                    </>
                                ) : request.invoice && request.pay_receipt ? (
                                    <p>Status: Processing Invoice</p>
                                ) : request.invoice ? (
                                    <>
                                        <button onClick={() => handleDownloadInvoice(request.req_id)}>
                                            View Invoice
                                        </button>
                                        <button onClick={() => handleUploadReceipt(request.req_id)}>
                                            Upload Receipt
                                        </button>
                                        <p>
                                            <strong onClick={() => RSAcheck("i", request.invoice, request.inv_rsa, pubKey)}>Status:</strong>
                                            <span
                                                style={{
                                                    color: invoiceRSA ? 'green' : 'red',
                                                }}
                                            >
                                                {invoiceRSA ? 'RSA Signed' : 'Not RSA Signed'}
                                            </span>
                                        </p>
                                    </>
                                ) : (
                                    <p>Status: Request Pending</p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ViewRequests;
