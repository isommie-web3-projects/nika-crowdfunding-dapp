import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Sidebar, Navbar } from './components';
import { CampaignDetails, CreateCampaign, Home, Profile, Landing } from './pages';
import { useLocation } from 'react-router-dom'

const App = () => {
  const location = useLocation()
  return (
    <>
      <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
        {location.pathname !== '/' && (
        <div className="sm:flex hidden mr-10 relative">
          <Sidebar />
        </div>
        )}
        <div className="flex-2 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
          <Navbar />

          <Routes>
            <Route path="/" element={<Landing />} exact />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-campaign" element={<CreateCampaign />} />
            <Route path="/campaign-details/:id" element={<CampaignDetails />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App