// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.9.0;

contract CampaignFactory {
    Campaign[] public deployedCampaigns;

    function createCampaign(uint _minPledge) public {
        Campaign newCampaign = new Campaign(_minPledge, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct PaymentRequest {
        string description;
        uint amount;
        address payable recipient;
        bool isSettled;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    address public creator;
    uint public minPledge;
    uint public backerCount;
    uint public requestCount;
    mapping(address => bool) public backers;
    mapping(uint => PaymentRequest) public paymentRequests;

    constructor(uint _minPledge, address _creator) {
        creator = _creator;
        minPledge = _minPledge;
    }
    
    function makePledge() public payable {
        require(msg.value >= minPledge, "A minumum pledge is required for this campaign");
        
        backers[msg.sender] = true;
        backerCount++;
    }
    
    function makePaymentRequest(string memory _description, uint _amount, address payable _recipient) public onlyCreator {
        require(address(this).balance >= _amount, "The amount requested exceed the current balance");
        PaymentRequest storage request = paymentRequests[requestCount++];
        
        request.description = _description;
        request.amount = _amount;
        request.recipient = _recipient;
        request.isSettled = false;
        request.approvalCount = 0;
    }
    
    function approveRequest(uint _index) public {
        PaymentRequest storage request = paymentRequests[_index];
        require(backers[msg.sender], "Only backers can approve this payment request");
        require(requestCount > _index , "Payment request not found");
        require(!request.approvals[msg.sender], "You already voted in this payment request");
        require(!request.isSettled, "This payment request had already been settled");
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    
    function settleRequest(uint _index) public onlyCreator {
        PaymentRequest storage request = paymentRequests[_index];
        require(request.approvalCount > (backerCount / 4), "This payment request needs more approvals before it can be settled");
        require(!request.isSettled, "This payment request had already been settled");
        require(address(this).balance > request.amount, "Current balance are not enough");

        request.recipient.transfer(request.amount);
        request.isSettled = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (minPledge, address(this).balance, requestCount, backerCount, creator);
    }

    modifier onlyCreator() {
        require(msg.sender == creator, "Only the campaign creator can call this function");
        _;
    }
}