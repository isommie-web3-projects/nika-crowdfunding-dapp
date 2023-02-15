// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract CrowdFunding {
    // Struct to represent a crowdfunding campaign
    struct Campaign {
        // the address of the campaign owner
        address owner; 
        // the title of the campaign
        string title; 
        // the description of the campaign
        string description; 
        // the target funding amount for the campaign
        uint256 target; 
        // the deadline for the campaign
        uint256 deadline; 
        // the total amount of funds collected so far
        uint256 amountCollected; 
        // the image associated with the campaign
        string image; 
        // list of addresses of donors
        address[] donators; 
        // list of amounts donated by each donor
        uint256[] donations; 
    }

    // Mapping from campaign ID to campaign struct
    mapping(uint256 => Campaign) public campaigns;

    // Number of campaigns created on the platform
    uint256 public numberOfCampaigns = 0;

    // Function to create a new crowdfunding campaign
    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        // Confirm that the deadline is a future date
        require(_deadline > block.timestamp, "The deadline should be a date in the future.");

        // Create a new campaign struct and populate it with the provided data
        Campaign storage campaign = campaigns[numberOfCampaigns];
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;

        // Increment the number of campaigns and return the ID of the new campaign
        numberOfCampaigns++;
        return numberOfCampaigns - 1;
    }

        // Function to allow a user to donate to a campaign
    function donateToCampaign(uint256 _id) public payable {
        // Get donation amount
        uint256 amount = msg.value;

        // Ensure that the donation value is a positive integer greater than zero
        require(amount > 0, "Please, donation value must be greater than 0.");

        // Check that the campaign with the specified ID exists
        require(_id < numberOfCampaigns, "Campaign with specified ID does not exist.");

        // Get campaign struct
        Campaign storage campaign = campaigns[_id];

        // Add the donor and donation amount to the campaign's lists
        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        // Send the donation amount to the campaign owner
        (bool sent,) = payable(campaign.owner).call{value: amount}("");

        // If transfer was successful, update the amount collected for the campaign and disburse the funds
        if (sent) {
            campaign.amountCollected = campaign.amountCollected + amount;
            disburseFunds(_id);
        }
    }

    // Function to disburse funds for a specific campaign
    function disburseFunds(uint256 _id) private {
        Campaign storage campaign = campaigns[_id];

        // Check if the deadline has passed and the target has been reached
        if (block.timestamp >= campaign.deadline && campaign.amountCollected >= campaign.target) {
            // Transfer the collected funds to the campaign owner
            (bool sent,) = payable(campaign.owner).call{value: campaign.amountCollected}("");
            require(sent, "Failed to send funds");

            // Clear the list of donators and donations
            delete campaign.donators;
            delete campaign.donations;
        }
    }


    // View function to get the list of donators and their donations for a specific campaign
    function getDonators(uint256 _id) view public returns(address[] memory, uint256[] memory){
        // Check that the campaign with the specified ID exists
        require(_id < numberOfCampaigns, "Campaign with specified ID does not exist.");

        // Return the list of donators and their donations for the specified campaign
        return (campaigns[_id].donators, campaigns[_id].donations);
    }


    // View function to get all the campaigns created on the platform
    function getCampaigns() public view returns (Campaign[] memory) {
        // Create an array to hold the campaigns
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        // Populate the array with the campaigns from the mapping
        for(uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }

        // Return the array of campaigns
        return allCampaigns;
    }



}