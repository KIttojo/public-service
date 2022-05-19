import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Select,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack,
  VStack,
  InputGroup,
  InputLeftElement,
  Text
} from '@chakra-ui/react';
import { BsPerson } from 'react-icons/bs';
import axios from 'axios';
// import { MdOutlineEmail } from 'react-icons/md';

const initFormField = {
  type: '',
  count: '10',
};

export default function Payment({rates}) {
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem('user-data')).user;
  const {firstName, lastName, address} = userData;
  const [formData, setFormData] = useState({
    name: `${firstName} ${lastName}`,
    addres: address,
    states: [initFormField]
  });
  const [showPayment, setShowPayment] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [total, setTotal] = useState(0);

  console.log("FORM=", formData.states);

  const calulateTotalPrice = () => {
    let totalPrice = 0;
    for (const item of formData.states) {
      totalPrice += item.cost; 
    }
    setTotal(totalPrice);
  }

  const calculateCost = (type, value) => {
    const typeRate = rates.find((elem) => elem.latinName === type);
    return typeRate.price * value;
  }

  const updateForm = (type, value, key, id) => {
    setFormData(prev => {
      if (type === 'states') {
        const isKey = key === 'key';
        let newStates = [...prev.states];
        const newItem = {
          type: isKey ? value : newStates[id].type,
          value: isKey ? newStates[id].value : value,
        }
        newItem.cost = newItem.type && newItem.value ? calculateCost(newItem.type, newItem.value) : 0;
        newStates[id] = newItem;
        return {
          ...prev,
          [type] : newStates
        }
      }

      return {...prev, [type] : value};
    });
  }

  const addField = () => {
    setFormData(prev => {
      return {
        ...prev,
        'states': [...prev.states, {type: '', value: '10'}]
      };
    })
  }
  
  const removeField = () => {
    setFormData(prev => {
      const newArr = [...prev.states];
      console.log('old=', newArr)
      newArr.pop();

      return {
        ...prev,
        'states': newArr
      };
    })
  }

  const handleSublit = () => {
    let errorsCount = 0;
    calulateTotalPrice();

    for (let i = 0; i < formData.states.length; i++) {
      const element = formData.states[i];
      if (element.type.length < 1) errorsCount = errorsCount + 1;
    }

    if (errorsCount > 0) {
      setHasError(true);
      setShowPayment(false);
    } else {
      setHasError(false);
      setShowPayment(true);
    }
  }

  const handlePayment = () => {
    console.log(formData.states);
    axios.post('http://localhost:8080/api/invoices',
        {
          invoices: formData.states,
        },
        {
          headers: { 'x-access-token': localStorage.getItem('token') },
        }
      )
      .then(res => {
        navigate('/');
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} justify={'center'}>
        <Stack spacing={4} w={'full'} maxW={'md'}>
          <Heading fontSize={'2xl'}>Оплата счета</Heading>
          <FormControl id="text">
            <FormLabel>Полное имя</FormLabel>
            <Input isDisabled value={`${firstName} ${lastName}`} type="text" onChange={(e) => updateForm('name', e.target.value)}/>
          </FormControl>
          <FormControl id="text">
            <FormLabel>Адрес</FormLabel>
            <Input isDisabled value={`${address}`} type="text" onChange={(e) => updateForm('addres', e.target.value)}/>
          </FormControl>

          {formData.states.map((item, id) => 
            <Stack
              direction={{ base: 'column', sm: 'row' }}
              align={'start'}
              justify={'space-between'}>
              <FormControl>
                <FormLabel htmlFor='country'>Тип показания</FormLabel>
                <Select 
                  id='country' 
                  placeholder='Выберите тип' 
                  onChange={(e) => updateForm('states', e.target.value, 'key', id)}>
                  <option >Газ</option>
                  <option >Электричество</option>
                  <option >Вода</option>
                </Select>
              </FormControl>
              <FormControl maxW='140'>
                <FormLabel htmlFor='amount'>Значение</FormLabel>
                <NumberInput defaultValue={10} max={100000} min={10} onChange={val => updateForm('states', val, 'value', id)}>
                  <NumberInputField id='amount'/>
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <FormControl maxW='100'>
                <FormLabel htmlFor='amount'>Цена</FormLabel>
                <NumberInput isDisabled value={item.cost} defaultValue={0}>
                  <NumberInputField id='cost'/>
                </NumberInput>
              </FormControl>
            </Stack>
          )}

          <Flex justify='space-between'>
            <Button colorScheme='blue' maxW='190' onClick={addField}>Добавить показание</Button>
            {formData.states.length > 1 && (
              <Button colorScheme='red' maxW='190' onClick={removeField}>Удалить запись</Button>
            )}
          </Flex>

          {(!showPayment || hasError) && (
            <Button colorScheme={'blue'} variant={'solid'} onClick={handleSublit}>
              Ввести реквизиты
            </Button>
          )}

          {hasError && <Text colorScheme={'red'}>Проверьте правильность полей</Text>}
          
          {(showPayment && !hasError) && (
            <Box
              bg={'gray.700'}
              borderRadius="lg"
              p={8}
              color={'whiteAlpha.900'}
              shadow="base">
              <VStack spacing={5}>

              <Heading fontSize={'2xl'}>Итого к оплате: {total}₽</Heading>

                <FormControl isRequired>
                  <FormLabel>Номер карты</FormLabel>
                  <InputGroup>
                    <InputLeftElement children={<BsPerson />} />
                    <Input type="number" name="name" placeholder="Номер" />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Месяц</FormLabel>
                  <InputGroup>
                    <InputLeftElement children={<BsPerson />} />
                    <Input type="text" name="name" placeholder="Месяц/год" />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Код безопасности</FormLabel>
                  <InputGroup>
                    <InputLeftElement children={<BsPerson />} />
                    <Input type="text" name="name" placeholder="CVC2/CVV2" />
                  </InputGroup>
                </FormControl>

                <Button
                  colorScheme="blue"
                  bg="blue.400"
                  color="white"
                  _hover={{
                    bg: 'blue.500',
                  }}
                  onClick={handlePayment}>
                  Оплатить
                </Button>
              </VStack>
            </Box>
          )}
        </Stack>
      </Flex>
    </Stack>
  );
}