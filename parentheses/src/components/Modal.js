import { useEffect, useState } from "react";
import "./Modal.css";

const Modal = ({ setModalOpen, contract }) => {
  const [accessList, setAccessList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  const shareAccessTo = async () => {
    const addressOfUser =
      selectedAddress || document.querySelector(".modal-address").value;
    await contract.allow(addressOfUser);
    setModalOpen(false);
  };

  useEffect(() => {
    const fetchAccessList = async () => {
      const userList = await contract.shareAccess();
      setAccessList(userList);
    };

    if (contract) {
      fetchAccessList();
    }
  }, [contract]);

  const handleSelectChange = (event) => {
    const ele = event.target.value.slice(11);
    setSelectedAddress(ele);
  };

  const removeAccess = async (userAddress) => {
    await contract.disallow(userAddress);
    setAccessList(accessList.filter((user) => user.user_add !== userAddress));
  };

  return (
    <>
      <div className="modal-background">
        <div className="modal-container">
          <div className="modal-title">Share with</div>
          <div className="modal-body">
            <input
              type="text"
              className="modal-address"
              placeholder="Enter Address"
              value={selectedAddress}
              onChange={(event) => setSelectedAddress(event.target.value)}
            />
          </div>
          <form id="myForm">
            <select id="selectNumber" onChange={handleSelectChange}>
              <option value="" className="people">
                People With Access
              </option>
              {accessList.map((user, index) => (
                <option key={index} value={user.user_add}>
                  Account {index + 1}: {user}
                </option>
              ))}
            </select>
          </form>
          <div className="modal-footer">
            <button onClick={() => setModalOpen(false)} id="cancelBtn">
              Cancel
            </button>
            <button onClick={shareAccessTo}>Share</button>
            <button onClick={() => removeAccess(selectedAddress)}>
              Remove Access
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
