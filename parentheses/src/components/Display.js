import { useState } from "react";
import "./Display.css";

const Display = ({ contract, account }) => {
  const [data, setData] = useState("");

  const getDataFromUser = async () => {
    let dataArr;
    const otherAddressOfUsers = document.querySelector(".input-address").value;
    try {
      if (otherAddressOfUsers) {
        dataArr = await contract.display(otherAddressOfUsers);
        console.log(dataArr);
      } else {
        dataArr = await contract.display(account);
      }
    } catch (e) {
      alert("You don't have access");
    }

    const isEmpty = Object.keys(dataArr).length === 0;

    if (!isEmpty) {
      const str = dataArr.toString();
      const strArray = str.split(",");
      const files = strArray.map((item, i) => {
        return (
          <a href={item} key={i} target="_blank" rel="noopener noreferrer">
            <img
              key={i}
              src={`https://gateway.pinata.cloud/ipfs/${item.substring(6)}`}
              alt="new"
              className="image-item"
            />
          </a>
        );
      });
      setData(files);
    } else {
      alert("No image to display");
    }
  };

  return (
    <div className="display-container">
      <div className="image-container">{data}</div>

      <div className="get-data">
        <input
          type="text"
          placeholder="Enter Address"
          className="input-address"
        />
        <button className="centered-button" onClick={getDataFromUser}>
          Get Data
        </button>
      </div>
    </div>
  );
};

export default Display;
