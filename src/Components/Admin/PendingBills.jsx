import { useEffect, useState } from "react";
import axiosInstance from "../../Api/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRefresh } from "../../Context/Context";

function PendingBills() {
    const [billings, setBillings] = useState([]);
    const [decisionLists, setDecisionLists] = useState([]);
    const [reject, setReject] = useState(false);
    const [selectedDecision, setSelectedDecision] = useState(""); 
    const {refresh ,setRefresh}= useRefresh() 

  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axiosInstance.get("/admin/getBillings");
          setBillings(response.data.billings);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }, [refresh]);
  
    const handleApproveBill = async (billId) => {
      await axiosInstance.put(`/admin/ApproveBills/${billId}`);
      toast.success('Bill is Approved')
      setRefresh(!refresh);
    };
  
    // Function to get decision list
    const fetchDecisionText = async () => {
      const response = await axiosInstance.get("/admin/decisionText");
      setDecisionLists(response.data.DecisionLists);
    };
  
    // Function for changing bill status to rejected
    const handleBillStatus = async (billId, decisionId) => { 
      try {
        if(decisionId === ''){
          toast.warn('Please select a reason');
        } else {
          await axiosInstance.put(`/admin/billStatus/${billId}`, { decisionId }); 
          setReject(false);
          toast.success('Bill Rejected');
          setRefresh(!refresh);
        }
      } catch (error) {
        console.error(error);
      }
    };
    
    // Filter pending bills
    const pendingBills = billings.filter(item => item.BillStatus === 'Pending');

    return (
      <div className="relative m-3 text-white">
        {pendingBills.length === 0 ? (
          <h1 className="text-black text-center font-bold">No bills found</h1>
        ) : (
          pendingBills.map((item) => (
            <div
              key={item._id}
              className={`bg-black my-3 mx-10 p-8 rounded-lg ${reject ? "opacity-50" : ""}`}
            >
              <div className="sm:flex justify-between">
                <div>
                  <div className="my-2">
                    <h1 className="font-semibold">Patient Name</h1>
                    <h1>{item.PatientName}</h1>
                  </div>
                  <div className="my-2">
                    <h1 className="font-semibold">Doctor Name </h1>
                    <h1>{item.DoctorName}</h1>
                  </div>
                  <div className="my-2">
                    <h1 className="font-semibold">Date of Service</h1>
                    <h1>{item.DateOfService}</h1>
                  </div>
                  <div className="my-2">
                    <h1 className="font-semibold">Phone Number</h1>
                    <h1>{item.PhoneNumber}</h1>
                  </div>
                </div>
                <div>
                  <div className="my-2">
                    <h1 className="font-semibold">Amount</h1>
                    <h1>{item.Amount}</h1>
                  </div>
                  <div className="my-2">
                    <h1 className="font-semibold">Specialty Code</h1>
                    <h1>{item.SpecialityCode}</h1>
                  </div>
                  <div className="my-2">
                    <h1 className="font-semibold">Procedure Code</h1>
                    <h1>{item.ProcedureCode}</h1>
                  </div>
                  <div className="my-2">
                    <h1 className="font-semibold">Procedure Description</h1>
                    <h1>{item.ProcedureDescription}</h1>
                  </div>
                </div>
              </div>
              <div className="flex sm:gap-5 justify-center mt-3">
                <button
                  onClick={() => handleApproveBill(item._id)}
                  className={`bg-white text-black p-1 px-3 rounded-full hover:bg-green-400 ${reject ? "cursor-not-allowed opacity-50" : ""}`}
                  disabled={reject}
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    fetchDecisionText();
                    setReject(true);
                  }}
                  className={`bg-white text-black p-1 px-4 rounded-full hover:bg-red-600 ${reject ? "cursor-not-allowed opacity-50" : ""}`}
                  disabled={reject}
                >
                  Reject
                </button>
              </div>
              {reject && (
                <div className="absolute inset-0 flex justify-center items-center z-20">
                  <div className="bg-black text-white p-3 w-11/12 max-w-sm rounded-lg relative">
                    <h1 className="font-bold my-3 text-center">
                      Reason For Rationale Reject
                    </h1>
                    <div className="w-full text-black">
                      <select
                        className="w-full p-1 px-2 relative z-20"
                        name="reject"
                        id="reject"
                        value={selectedDecision} 
                        onChange={(e) => setSelectedDecision(e.target.value)} 
                      >
                        <option className="" value="">
                          Select
                        </option>
                        {decisionLists.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.DecisionText}
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-4 justify-center my-4">
                        <button
                          onClick={() => setReject(false)}
                          className="p-1 px-3 text-black bg-white rounded-lg font-semibold"
                        >
                          Go back
                        </button>
                        <button
                          onClick={() => handleBillStatus(item._id, selectedDecision)}
                          className="p-1 px-3 bg-white text-black rounded-lg font-semibold"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <ToastContainer/>
      </div>
    );
}

export default PendingBills;
