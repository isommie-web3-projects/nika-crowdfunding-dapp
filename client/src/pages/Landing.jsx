import React, { useState, useEffect } from 'react';
import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context'
import { CustomButton } from '../components';
import { useNavigate } from 'react-router-dom';
import nikaLogo from '../assets/nikaLogo.gif';


const Landing = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [showCampaigns, setShowCampaigns] = useState(false);


  const { address, contract, getCampaigns, connect} = useStateContext();

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
        <div>
            <div className="flex flex-col items-center justify-center pt-12 pb-12 bg-[url('https://source.unsplash.com/random')] w-50 rounded-full h-50 sm:flex sm:items-center sm:justify-center">
            <img src={nikaLogo} alt="nikaLogo" className="w-[300px] h-[200px] object-contain"/>
            </div>
            
            <div className="flex flex-col items-center justify-center pt-10 ">
            <h2 className="text-2xl font-medium text-gray-200 mb-4 animate-bounce duration-2s infinite sm:text-sm flex text-center lg:text-4xl">Welcome to Nika Crowdfunding Platform</h2>
            <p className="text-xl font-medium text-gray-300 mb-8 animate-bounce duration-2s infinite sm:text-xs flex text-center lg:text-base">
                Browse and support amazing campaigns.
            </p>


            {/* <button className="px-6 py-4 font-medium text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline animate-bounce sm:px-4 sm:py-3 sm:text-lg lg:px-5 lg:py-4 lg:text-xl"
                      onClick={() => {
                        if (!connect) {
                          alert("Please connect your wallet before browsing campaigns");
                        } else {
                          setShowCampaigns(true);
                        }
                      }}
                    >
                    Browse Campaigns
            </button> */}

              <div className="sm:flex flex-row justify-end gap-4">
                <CustomButton 
                  btnType="button"
                  title={address ? 'Browse Campaigns' : 'Campaigns'}
                  styles={address ? 'bg-[#0e1a40]' : 'bg-[#0e1a40]'}
                  handleClick={() => {
                    if(address) navigate('home')
                    else connect()
                  }}
                />
              </div>

            </div>
        </div>


    );
  }
}

export default Landing

// import { loader } from '../assets';
{/* <img src={nikaLogo} alt="nikaLogo" className="w-[40px] h-[40px] object-contain"/> */}