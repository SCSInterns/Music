import logo from './logo.svg';
import './App.css';
import Login from './component/SuperAdmin/Login';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
  Navigate , 
  useNavigate
} from "react-router-dom";
import Home from './component/User/Home';
import RegForm from './component/Academy/RegForm';
import Signup from './component/Academy/Signup';
import Inquiry from './component/SuperAdmin/Inquiry'
import AcademyDashboard from './component/Academy/AcademyDashboard';
import FranchiseForm from './component/Academy/Franchiseform'
import AcademyLogin from './component/Academy/Login'
import PersonalDetails from './component/Academy/PersonalDetails'


function App() { 
 
  return (
    <div className="App">
      <Router> 
        <Routes> 
          <Route exact path='/' element={<Home/>}></Route>
          <Route exact path='/superadmin/login' element={<Login />}></Route>
          <Route exact path='/superadmin/dashboard' element={<Inquiry/>}/>
          <Route exact path='/academyregform' element={<RegForm/>}></Route>
          <Route exact path='/academysignup' element={<Signup/>}></Route>
          <Route exact path='/admin/dashboard' element={<AcademyDashboard/>}></Route>
          <Route exact path='/admin/login' element={<AcademyLogin/>}></Route>
          <Route exact path='/franchiseform/:id' element={<FranchiseForm/>} ></Route>
          <Route exact path='/personaldetails/:id' element={<PersonalDetails/>} ></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
