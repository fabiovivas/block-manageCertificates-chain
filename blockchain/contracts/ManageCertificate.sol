// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity ^0.6.8;

contract ManageCertificate {

    address private owner;

    constructor() public {
        owner = msg.sender;
    }

    struct Certificate {
        address studentId;
        address schoolId;
        string ipfsId;
    }
    
    mapping(address => bool) public isSchool;
    mapping(address => bool) public isStudent;
    mapping(address => mapping(address => bool)) private studentsBySchool;
    mapping(address => mapping(address => Certificate[])) private certificateByStudents;
    mapping(address => mapping(address => bool)) public certificateAccess;

    event schoolRegistered(address schoolId);
    event studentRegistered(address studentId, address schoolId);
    event CertificateEmited(address studentId, address schoolId, string ipfsId);

    modifier onlyOwner() {
        require(msg.sender == owner, "msg.sender is not a owner");
        _;
    }

    modifier onlySchool() {
        require(isSchool[msg.sender], "msg.sender is not a school.");
        _;
    }

    modifier onlyStudent() {
        require(isStudent[msg.sender], "msg.sender is not a student.");
        _;
    }

    function registerSchool(address schoolId) public onlyOwner {
        isSchool[schoolId] = true;
        emit schoolRegistered(schoolId);
    }

    function registerStudent(address studentId) public onlySchool {
        studentsBySchool[msg.sender][studentId] = true;
        certificateAccess[studentId][msg.sender] = true;
        isStudent[studentId] = true;
        emit studentRegistered(studentId, msg.sender);
    }

    function emiteCertificate(address studentId, string memory ipfsIdDocument) public onlySchool {
        require(studentsBySchool[msg.sender][studentId], "This student doesn't participate of your school");
        certificateByStudents[studentId][msg.sender].push(
            Certificate(studentId, msg.sender, ipfsIdDocument)
        );
        emit CertificateEmited(studentId, msg.sender, ipfsIdDocument);
    }

    function allowAccess(address addr) public onlyStudent {
        certificateAccess[msg.sender][addr] = true;
    }

    function removeAccess(address addr) public onlyStudent {
        certificateAccess[msg.sender][addr] = false;
    }

    function getCertificates(address studentId, address schoolId) public view returns(Certificate[] memory) {
        require(certificateAccess[studentId][msg.sender], "You don't have access to this information");
        Certificate[] memory certificates = certificateByStudents[studentId][schoolId];        
        return certificates;
    } 
}
