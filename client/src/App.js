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


function App() {
  const verified = sessionStorage.getItem("accesstoken");
  const role = sessionStorage.getItem("role")

  let academyname = sessionStorage.getItem("academyname")

  const adminDashboardPath = `/${academyname}/admin/dashboard`;
  const adminRegFormPath = `/${academyname}/admin/regform`;



  return (
    <div className="App">
      <Router>
        <Routes>

          {/* Superadmin routes  */}
          {verified && (role === "Superadmin") ?
            <>
              <Route exact path='/superadmin/dashboard' element={<Inquiry />} />
              <Route exact path='/superadmin/accepotedapplication' element={<AcceptedApplication />} />
            </> :
            <>
              <Route exact path='/superadmin/login' element={<Login />}></Route>
              <Route exact path='/superadmin/dashboard' element={<Navigate to='/superadmin/login' />} />
            </>}


          {/* Admin routes  */}

          {verified && (role === "Admin") ?
            <>
              <Route exact path={adminDashboardPath} element={<AcademyDashboard />}></Route>
              <Route exact path={adminRegFormPath} element={<AcademyRegistration />}></Route>

            </> :
            <>
              <Route exact path='/academyregform' element={<RegForm />}></Route>
              <Route exact path='/academysignup/:id' element={<Signup />}></Route>
              <Route exact path='/admin/login' element={<AcademyLogin />}></Route>
              <Route exact path='/personaldetails/:id' element={<PersonalDetails />} ></Route>
              <Route exact path='/admin/dashboard' element={<Navigate to='/admin/login' />}></Route>
            </>}


          {/* public routes  */}

          <Route exact path='/:academyname' element={<Home />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
