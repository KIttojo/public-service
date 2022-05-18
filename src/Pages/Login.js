import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

import { Link as RouterLink } from "react-router-dom";
import React, {useState, setState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function SimpleCard({setUser}) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSumbit = (e) => {
    e.preventDefault();
    axios({
      url: "http://localhost:8080/api/authenticate",
      method: "post",
      data: JSON.stringify({
        email: email,
        password: password,
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => {
        if (res.status === 200) {
          console.log(res.data);
          setUser({name: `${res.data.user.firstName} ${res.data.user.lastName}`, role: res.data.user.role});
          console.log(res.headers);
          localStorage.setItem('token', res.headers['x-token']);
          localStorage.setItem('user-data', JSON.stringify(res.data));
          navigate('/');
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch(err => {
        console.error(err);
        alert('Error logging in please try again');
      });
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Heading fontSize={'4xl'}>Войти в профиль</Heading>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="text">
              <FormLabel>Логин</FormLabel>
              <Input 
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required 
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Пароль</FormLabel>
              <Input 
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required 
              />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Checkbox marginRight={'10px'}>Запомнить меня</Checkbox>
                <RouterLink to='/register'>
                  <Link color={'blue.400'}>Нет аккаунта?</Link>
                </RouterLink>
              </Stack>
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={handleSumbit}>
                Войти
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}