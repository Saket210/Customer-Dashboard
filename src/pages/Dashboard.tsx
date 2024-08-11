import './Dashboard.css'
import { useState } from "react";
import CustomerDetails from "../components/CustomerDetails/CustomerDetails"
import Sidebar from "../components/Sidebar/Sidebar"


const Dashboard = () => {

  const [activeCustomerId, setActiveCustomerId] = useState<string>("");

  return (
    <div className="dashboard-div">
        <Sidebar activeCustomerId = {activeCustomerId} setActiveCustomerId={setActiveCustomerId}/>
        <div className='details-div'>
        <CustomerDetails activeCustomerId = {activeCustomerId}/>
        </div>
    </div>
  )
}

export default Dashboard