// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity ^0.6.8;


contract ManageCertificate {
    address private owner;
    uint256 public priceInWei;

    constructor() public {
        owner = msg.sender;
        priceInWei = 1000000000000000000;
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
        require(msg.sender == owner, "you are not a owner");
        _;
    }

    modifier onlySchool() {
        require(isSchool[msg.sender], "you are not a school.");
        _;
    }

    modifier onlyStudent() {
        require(isStudent[msg.sender], "you are not a student.");
        _;
    }

    modifier correctAddress(address addr) {
        require(addr != address(0x0), "Invalid address");
        _;
    }

    function alterPrice(uint256 newPrice) public onlyOwner {
        priceInWei = newPrice;
    }

    function collectEther() public payable onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Transfer failed.");
    }

    function registerSchool() public payable {
        require(msg.value >= priceInWei, 'the value is not enough for this transaction');

        isSchool[msg.sender] = true;
        emit schoolRegistered(msg.sender);
    }

    function registerStudent(address studentId) public onlySchool correctAddress(studentId) {
        require(msg.sender != studentId, "You can't register yourself like student");

        studentsBySchool[msg.sender][studentId] = true;
        allowAccess(studentId, msg.sender);
        allowAccess(studentId, studentId);
        isStudent[studentId] = true;
        emit studentRegistered(studentId, msg.sender);
    }

    function emiteCertificate(address studentId, string memory ipfsIdDocument) public onlySchool correctAddress(studentId) {
        require(studentsBySchool[msg.sender][studentId], "This student doesn't participate of your school");
        
        certificateByStudents[studentId][msg.sender].push(
            Certificate(studentId, msg.sender, ipfsIdDocument)
        );
        emit CertificateEmited(studentId, msg.sender, ipfsIdDocument);
    }

    function allowExternalAccess(address addr) public onlyStudent
    {
        allowAccess(msg.sender, addr);
    }

    function allowAccess(address studentId, address addr) internal correctAddress(addr) {
        certificateAccess[studentId][addr] = true;
    }

    function removeAccess(address addr) public onlyStudent correctAddress(addr) {
        require(msg.sender != addr, "You can not remove your access");
        certificateAccess[msg.sender][addr] = false;
    }

    function getCertificates(address studentId, address schoolId) public view returns (Certificate[] memory) {
        require(certificateAccess[studentId][msg.sender], "You don't have access to this information");

        Certificate[] memory certificates = certificateByStudents[studentId][schoolId];
        return certificates;
    }
}
