import logo from './logo.svg';
import './App.css';
import Login from './component/SuperAdmin/Login';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
  Navigate,
  useNavigate,
  useParams
} from "react-router-dom";
import Home from './component/User/Home';
import RegForm from './component/Academy/RegForm';
import Signup from './component/Academy/Signup';
import Inquiry from './component/SuperAdmin/Inquiry'
import AcademyDashboard from './component/Academy/AcademyDashboard';
import AcademyLogin from './component/Academy/Login'
import PersonalDetails from './component/Academy/PersonalDetails'
import AcceptedApplication from './component/SuperAdmin/AcceptedApplication'
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import AcademyRegistration from './component/Academy/AcademyRegistration';
import PaymentDetails from './component/Academy/PaymentDetails';
import Banner from './component/User/Banner';
import Error from './component/User/Error';
import About from './component/User/About';
import Event from './component/User/Event';
import Instrument from './component/User/Instrument';
import Form from './component/User/Form';
import Detailview from './component/User/Detailview';
import UserLogin from './component/User/Login';
import SetPassword from './component/User/SetPassword';
import Profile from './component/User/Profile';
import AutomatedAttendance from './component/Academy/AutomatedAttendance'
import NewAdminDashboard from './component/Academy/NewAdminDashboard';
import GalleryPage from './component/User/Gallery';
import LandingPage from './component/Business Website/LandingPage';
import NewSuperAdminDashboard from './component/SuperAdmin/NewSuperAdminDashboard'
import AcademySubscriptionPayment from './component/Academy/AcademySubscriptionPayment';
import MarketplaceHome from './component/MarketPlace/Landingpage'
import Aboutpage from './component/MarketPlace/Aboutpage';


function App() {
  const verified = sessionStorage.getItem("accesstoken");
  const role = sessionStorage.getItem("role")

  let academyname = sessionStorage.getItem("academyname")


  return (
    <div className="App">
      <Router>
        <Routes>

          {/* Superadmin routes  */}
          {verified && (role === "Superadmin") ?
            <>
              <Route path='/superadmin/dashboard' element={<NewSuperAdminDashboard />} />
              <Route path='/superadmin/accepotedapplication' element={<AcceptedApplication />} />
            </> :
            <>
              <Route path='/superadmin/login' element={<Login />}></Route>
              <Route path='/superadmin/dashboard' element={<Navigate to='/superadmin/login' />} />
            </>}


          {/* Admin routes  */}

          {verified && (role === "Admin") ?
            <>
              <Route path={'/:academyname/admin/dashboard'} element={<NewAdminDashboard />}></Route>
              <Route path={'/:academyname/admin/regform'} element={<AcademyRegistration />}></Route>
              <Route path={'/:academyname/admin/feesdetails'} element={<PaymentDetails />}></Route>
              <Route path={'/:academyname/attendance'} element={<AutomatedAttendance />}></Route>
            </> :
            <>
              <Route path='/academyregform' element={<RegForm />}></Route>
              <Route path='/academysignup/:id' element={<Signup />}></Route>
              <Route path='/admin/login' element={<AcademyLogin />}></Route>
              <Route path='/personaldetails/:id' element={<PersonalDetails />} ></Route>
              <Route path='/subscriptionpayment/:id' element={<AcademySubscriptionPayment />} ></Route>
              <Route path='/admin/dashboard' element={<Navigate to='/admin/login' />}></Route>
              <Route path={'/:academyname/attendance'} element={<AcademyLogin />}></Route>
            </>}


          {/* public routes  */}
          <Route path='/:academyname' element={<Home />} />
          <Route path='/:academyname/Banner' element={<Banner />} />
          <Route path='/:academyname/about' element={<About />} />
          <Route path='/:academyname/Gallery' element={<GalleryPage />} />
          <Route path='/:academyname/event' element={<Event />} />
          <Route path='/:academyname/registrationform' element={<Form />} />
          <Route path='/:academyname/instrument' element={<Instrument />} />
          <Route path='/:academyname/event/:id' element={<Detailview />} />
          <Route path='/:academyname/login' element={<UserLogin />} />
          <Route path='/:academyname/resetcred' element={<SetPassword />} />
          <Route path='/:academyname/userprofile' element={<Profile />} />

          <Route path='/error' element={<Error />} />


          {/* Business Website  */}

          <Route path='/business' element={<LandingPage />} />

          {/* Marketplace */}

          <Route path="/" element={<MarketplaceHome />} />
          <Route path="/About" element={<Aboutpage />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
