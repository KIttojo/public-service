import React, {useState, useEffect} from 'react';
import {ChakraProvider, theme} from '@chakra-ui/react';
import {Routes, Route} from "react-router-dom";

import Home from './Pages/Home';
import Login from './Pages/Login';
import SignupCard from './Pages/Register';
import NotFound from './Pages/Error';

import History from './Components/History';
import Payment from './Components/Payment';
import Admin from './Components/Admin';
import axios from 'axios';

function App() {
  const [user, setUser] = useState({name: '', role: ''});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rates, setRates] = useState([]);

  useEffect(() => {
    if (!user.name) setIsLoggedIn(false);
    if (user.name) {
      setIsLoggedIn(true);
      axios.get('http://localhost:8080/api/rates', {
        headers: {
          'x-access-token': localStorage.getItem('token'),
        }
      })
        .then((res) => {
          setRates(res.data.rates);
          console.log("RATES=,", res.data.rates);
      })
    } 
    else {
      axios.get('http://localhost:8080/checkToken', {
      headers: {
        'x-access-token': localStorage.getItem('token'),
      }
    })
      .then((res) => {
        if (res.status === 200) {
          const userData = JSON.parse(localStorage.getItem('user-data'));
          setUser({name: `${userData.user.firstName} ${userData.user.lastName}`, role: userData.user.role});
        }
      });
    }
  }, [user])

  return (
    <ChakraProvider theme={theme}>
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Home user={user} setUser={setUser}><History user={user}/></Home>} />
            <Route path="/home" element={<Home user={user} setUser={setUser}><History user={user}/></Home>} />
            <Route path="/home/history" element={<Home user={user} setUser={setUser}><History user={user}/></Home>} />
            <Route path="/home/payment" element={<Home user={user} setUser={setUser}><Payment rates={rates}/></Home>} />
            {user.role === 'admin' && (
              <Route path="/home/admin" element={<Home user={user} setUser={setUser}><Admin/></Home>} />
            )}
          </>
        ) : (
          <>
            <Route path="/" element={<Login setUser={setUser}/>} />
            <Route path="/login" element={<Login setUser={setUser}/>} />
            <Route path="/register" element={<SignupCard setUser={setUser}/>} />
          </>
        )}
        <Route path="/*" element={<NotFound isLoggedIn={isLoggedIn}/>} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
