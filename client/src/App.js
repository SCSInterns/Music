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
              <Route path='/superadmin/dashboard' element={<Inquiry />} />
              <Route path='/superadmin/accepotedapplication' element={<AcceptedApplication />} />
            </> :
            <>
              <Route path='/superadmin/login' element={<Login />}></Route>
              <Route path='/superadmin/dashboard' element={<Navigate to='/superadmin/login' />} />
            </>}


          {/* Admin routes  */}

          {verified && (role === "Admin") ?
            <>
              <Route path={'/:academyname/admin/dashboard'} element={<AcademyDashboard />}></Route>
              <Route path={'/:academyname/admin/regform'} element={<AcademyRegistration />}></Route>
              <Route path={'/:academyname/admin/feesdetails'} element={<PaymentDetails />}></Route>
            </> :
            <>
              <Route path='/academyregform' element={<RegForm />}></Route>
              <Route path='/academysignup/:id' element={<Signup />}></Route>
              <Route path='/admin/login' element={<AcademyLogin />}></Route>
              <Route path='/personaldetails/:id' element={<PersonalDetails />} ></Route>
              <Route path='/admin/dashboard' element={<Navigate to='/admin/login' />}></Route>
            </>}

          {/* path='' */}

          {/* public routes  */}

          <Route path='/:academyname' element={<Home />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
