// Importing required libraries
import React, { useContext, createContext } from 'react';
import { ethers } from 'ethers';
// import Modal from 'react-modal';

// Importing required components and hooks from external libraries
import { useAddress, useContract, useMetamask, useContractWrite, useDisconnect  } from '@thirdweb-dev/react';

// import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';

// Creating context to hold and share state information across components
const StateContext = createContext();

// Creating a component to provide state information to the entire application
export const StateContextProvider = ({ children }) => {
  // Retrieving contract instance using useContract hook from third-party library
  const { contract } = useContract('0xE6ac95DE3f96C6FCAFd1Ae8462A56ffB1A4B8A44');

  // Retrieving a method for contract write operations using useContractWrite hook from third-party library
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

  // Retrieving the current user's address using useAddress hook from third-party library
  const address = useAddress();

  // Retrieving the current user's Metamask wallet using useMetamask hook from third-party library
  const connect = useMetamask();

  // Retrieving the method to disconnect from the current user's Metamask wallet using useDisconnect hook from third-party library
  const disconnect = useDisconnect();

  // A function to create and publish a new campaign using the createCampaign method from the smart contract
  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign([
        address, // owner address
        form.title, // owner title
        form.description, // description
        form.target,
        new Date(form.deadline).getTime(), // deadline,
        form.image
      ])

      console.log("contract call success", data)
    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  // A function to retrieve all campaigns from the smart contract
  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaigns');

    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i
    }));

    return parsedCampaings;
  }


  // A function to retrieve all campaigns owned by the current user from the smart contract
  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }

  // A function to donate a specified amount to a specified campaign using the donateToCampaign method from the smart contract
  const donate = async (pId, amount) => {
    const data = await contract.call('donateToCampaign', pId, { value: ethers.utils.parseEther(amount)});

    return data;
  }

  // A function to retrieve all donations made to a specified campaign using the getDonators method from the smart contract
  const getDonations = async (pId) => {
    const donations = await contract.call('getDonators', pId);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for(let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    return parsedDonations;
  }


  return (
    <StateContext.Provider
      value={{ 
        address,
        contract,
        connect,
        disconnect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);