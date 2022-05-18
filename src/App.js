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

function App() {
  const [user, setUser] = useState({name: '', role: ''});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (user.name) setIsLoggedIn(true);
  }, [user])

  return (
    <ChakraProvider theme={theme}>
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Home user={user} setUser={setUser}><History/></Home>} />
            <Route path="/home" element={<Home user={user} setUser={setUser}><History/></Home>} />
            <Route path="/home/history" element={<Home user={user} setUser={setUser}><History/></Home>} />
            <Route path="/home/payment" element={<Home user={user} setUser={setUser}><Payment/></Home>} />
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
