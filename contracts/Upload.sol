// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Upload {
    struct UserAccess {
        address userAdd;
        bool access; // true or false
    }

    event FileAdded(address indexed user, string url);
    event AccessGranted(address indexed owner, address indexed user);
    event AccessRevoked(address indexed owner, address indexed user);

    mapping(address => string[]) private files; // for storing the URL of images uploaded at Pinata
    mapping(address => mapping(address => bool)) private owners; // nested mapping to define the access i.e if the second address has the access to first address's data
    mapping(address => UserAccess[]) private accessList; // mapping from address to struct array(created an array for struct
    mapping(address => mapping(address => bool)) private prevData; // nested mapping to store info about previous data

    function addFile(address _user, string memory url) external {
        files[_user].push(url);
        emit FileAdded(_user, url);
    }

    function grantAccess(address user) external {
        owners[msg.sender][user] = true;
        if (prevData[msg.sender][user]) {
            uint i = 0;
            while (i < accessList[msg.sender].length) {
                if (accessList[msg.sender][i].userAdd == user) {
                    accessList[msg.sender][i].access = true;
                    break;
                }
                i++;
            }
        } else {
            accessList[msg.sender].push(UserAccess(user, true));
            prevData[msg.sender][user] = true;
        }
        emit AccessGranted(msg.sender, user);
    }

    function revokeAccess(address user) public {
        owners[msg.sender][user] = false;
        uint i = 0;
        while (i < accessList[msg.sender].length) {
            if (accessList[msg.sender][i].userAdd == user) {
                accessList[msg.sender][i].access = false;
                break;
            }
            i++;
        }
        emit AccessRevoked(msg.sender, user);
    }

    function displayFiles(
        address _user
    ) external view returns (string[] memory) {
        require(
            _user == msg.sender || owners[_user][msg.sender],
            "You need to get access"
        );
        return files[_user];
    }

    function getAccessList() public view returns (UserAccess[] memory) {
        return accessList[msg.sender];
    }
}
