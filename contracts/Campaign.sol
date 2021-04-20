// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract CampaignFactory {
    Campaign[] public deployedCampaigns;

    function createCampaign(uint _minimumContribution) public {
        Campaign newCampaign = new Campaign(_minimumContribution, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns(Campaign[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct SpendRequest {
        string description;
        uint amountInWei;
        address payable beneficiary;
        mapping(address => bool) approvers;
        uint countApproved;
        bool complete;
    }

    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public contributors;
    uint public countContributors;
    SpendRequest[] public spendRequests;

    modifier restricted() {
        require(msg.sender == manager, "Sender must be the contract owner");
        _;
    }

    constructor(uint _minimumContribution, address _manager) {
        minimumContribution = _minimumContribution;
        manager = _manager;
    }

    function contribute() public payable {
        require(!contributors[msg.sender], "Already contributed");
        require(msg.value >= minimumContribution, "Contribution amount is too low");
        contributors[msg.sender] = true;
        countContributors++;
    }

    function createSpendRequest(string memory _description, uint _amountInWei, address payable _beneficiary) public restricted {
        SpendRequest storage request = spendRequests.push();
        request.description = _description;
        request.amountInWei = _amountInWei;
        request.beneficiary = _beneficiary;
    }

    function approveSpendRequest(uint index) public {
        SpendRequest storage request = spendRequests[index];
        require(!request.complete, "Spend Request already complete");
        require(!request.approvers[msg.sender], "Already approved Spend Request");
        request.approvers[msg.sender] = true;
        request.countApproved++;
    }

    function finaliseSpendRequest(uint index) public restricted {
        SpendRequest storage request = spendRequests[index];
        require(!request.complete, "Spend Request already complete");
        require(request.countApproved > countContributors / 2, "Not enough approvers");
        request.beneficiary.transfer(request.amountInWei);
        request.complete = true;
    }

    function countSpendRequests() public view returns (uint) {
        return spendRequests.length;
    }
}
