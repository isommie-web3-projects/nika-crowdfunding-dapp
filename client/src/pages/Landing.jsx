import React, { useState, useEffect } from 'react'

import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context'
import { CustomButton, Loader } from '../components';


const Landing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [showCampaigns, setShowCampaigns] = useState(false);

  const { address, contract, getCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) fetchCampaigns();
  }, [address, contract]);

  if (showCampaigns) {
    return (
      <DisplayCampaigns 
        title="All Campaigns"
        isLoading={isLoading}
        campaigns={campaigns}
      />
    )
  } else {
    return (
    <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-5xl font-bold text-gray-200 mb-4 animate-bounce duration-2s infinite">Welcome to Our Crowdfunding Platform</h1>
        <p className="text-xl font-medium text-gray-300 mb-8 animate-bounce duration-2s infinite">
        Browse and support amazing campaigns created by passionate people.
        </p>
        <button className="px-6 py-4 font-medium text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline animate-bounce"
                onClick={() => setShowCampaigns(true)}>
                {/* {isLoading && <Loader />} */}
        Browse Campaigns
        </button>
    </div>
    );
  }
}

export default Landing
