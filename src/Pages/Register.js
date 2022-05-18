import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';

import { useState } from 'react';
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import axios from 'axios';

export default function SignupCard() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');

  const handleSumbit = (e) => {
    e.preventDefault();
    axios({
      url: "http://localhost:8080/api/register",
      method: "post",
      data: JSON.stringify({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        address: address,
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => {
        if (res.status === 200) {
          navigate('/login');
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch(err => {
        console.error(err);
        alert('Error in registring please try again');
      });
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Регистрация
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>Имя</FormLabel>
                  <Input 
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required  />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName">
                  <FormLabel>Фамилия</FormLabel>
                  <Input 
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <FormLabel>Почтовый адрес</FormLabel>
              <Input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required />
            </FormControl>
            <FormControl id="address" isRequired>
              <FormLabel>Адрес проживания</FormLabel>
              <Input 
                type="text" 
                value={address}
                onChange={e => setAddress(e.target.value)}
                required />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Пароль</FormLabel>
              <InputGroup>
                <Input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required  />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={handleSumbit}>
                Создать учетную запись
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Уже зарегистрированы? <RouterLink to="/login"><Link color={'blue.400'}>Войти</Link></RouterLink>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}