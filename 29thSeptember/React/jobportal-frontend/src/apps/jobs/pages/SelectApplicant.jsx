import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SelectApplicant() {
  const { jobId } = useParams();
  const token = localStorage.getItem("accessToken");

  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
        console.log( `http://127.0.0.1:8000/api/jobposts/${jobId}/applicants/`)
      const response = await axios.get(
        `http://127.0.0.1:8000/api/jobposts/${jobId}/applicants/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log("select data")
      console.log(response.data);
      setApplicants(response.data.results);
    } catch (err) {
      console.error("Error fetching applicants:", err);
    }
  };

  return (
    <div className="flex max-w-6xl mx-auto mt-10 gap-6">

      {/* LEFT — LIST OF APPLICANTS */}
      <div className="w-1/3 bg-gray-100 p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Applicants</h2>

        {applicants.length === 0 && <p>No applicants yet.</p>}

        <ul className="space-y-3">
          {applicants.map(applicant => (
                        <li
            key={applicant.id}
            onClick={() => setSelectedApplicant(applicant)}
            className={`p-3 rounded-lg shadow cursor-pointer 
                ${selectedApplicant?.id === applicant.id 
                ? "bg-blue-100 border border-blue-500" 
                : "bg-white hover:bg-gray-200"}`}
            >
            <p className="font-semibold">{applicant.applicant.full_name}</p>
            <p className="text-sm text-gray-600">{applicant.applicant.email}</p>
            </li>

          ))}
        </ul>
      </div>

      {/* RIGHT — SHOW SELECTED APPLICANT DETAILS */}
      <div className="w-2/3 bg-white p-6 rounded-xl shadow">
        {!selectedApplicant && (
          <p className="text-gray-600">Click an applicant to view details</p>
        )}

        {selectedApplicant && (
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {selectedApplicant.applicant.full_name}
            </h2>

            <p><strong>Email:</strong> {selectedApplicant.applicant.email}</p>
            <p><strong>Mobile:</strong> {selectedApplicant.applicant.phone}</p>
            <p><strong>Skills:</strong> {selectedApplicant.applicant.skills}</p>
            <p><strong>Experience:</strong> {selectedApplicant.applicant.experience}</p>

            {/* Resume */}
            {selectedApplicant.resume && (
              <a
                href={selectedApplicant.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
              >
                View Resume
              </a>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
