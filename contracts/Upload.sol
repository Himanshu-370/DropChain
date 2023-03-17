// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Upload {
    struct UserAccess {
        address userAdd;
        bool access; // true or false
    }

    event FileAdded(address indexed user, string url); //When this event is triggered, it will log the user's address and the URL of the added file, which can be useful for tracking changes and updates to the smart contract's state.
    event AccessGranted(address indexed owner, address indexed user); // event to be emitted when a file is added
    event AccessRevoked(address indexed owner, address indexed user); // event to be emitted when a file is added

    mapping(address => string[]) private files; // for storing the URL of images uploaded at Pinata
    mapping(address => mapping(address => bool)) private owners; // nested mapping to define the access i.e if the second address has the access to first address's data
    mapping(address => UserAccess[]) private accessList; // mapping from address to struct array(created an array for struct
    mapping(address => mapping(address => bool)) private prevData; // nested mapping to store info about previous data

    function addFile(address _user, string memory url) external {
        ///function that allows user to add the url of images that he/she wants to upload
        files[_user].push(url);
        emit FileAdded(_user, url);
    }

    function grantAccess(address user) external {
        //function to give access to address
        owners[msg.sender][user] = true; //msg.sender address's data will be allowed to be accessed by user(stored in second address)
        //if suppose we take away the access of any address and then give it access again then address will be pushed again creating two
        //same address with different access so we have to check before pushing if address already exist
        if (prevData[msg.sender][user]) {
            uint i = 0;
            while (i < accessList[msg.sender].length) {
                if (accessList[msg.sender][i].userAdd == user) {
                    accessList[msg.sender][i].access = true; //then changing it's access to true
                    break;
                }
                i++;
            }
        } else {
            accessList[msg.sender].push(UserAccess(user, true)); //storing info that this user has access
            prevData[msg.sender][user] = true;
        }
        emit AccessGranted(msg.sender, user);
    }

    function revokeAccess(address user) public {
        //function to take away access from user
        owners[msg.sender][user] = false; //changing access to false so no access
        uint i = 0;
        while (i < accessList[msg.sender].length) {
            //will have to go through whole array to remove the address whose access has been revoked
            if (accessList[msg.sender][i].userAdd == user) {
                //finding the user data address in the array
                accessList[msg.sender][i].access = false; //cannot delete the address so just changing the access to false
                break;
            }
            i++;
        }
        emit AccessRevoked(msg.sender, user);
    }

    function displayFiles(
        //to display images
        address _user
    ) external view returns (string[] memory) {
        require(
            _user == msg.sender || owners[_user][msg.sender],
            "You need to get access"
        );
        return files[_user];
    }

    function getAccessList() public view returns (UserAccess[] memory) {
        //to return accesslist
        return accessList[msg.sender];
    }
}
