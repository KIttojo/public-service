import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  VStack,
  InputGroup,
  InputLeftElement,
  Text
} from '@chakra-ui/react';
import { BsPerson } from 'react-icons/bs';
import axios from 'axios';
import PriceTable from './PriceListTable';
import FormField from './FormField';

const initFormField = {
  type: '',
  count: '1',
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
  const [pastValues, setPastValues] = useState({});

  const allowedSelectors = [
    'Вода',
    'Электричество',
    'Газ',
    'Домофон',
    'Плата за капитальный ремонт',
    'Обслуживание лифта',
    'Вывоз мусора',
    'Центральное отопление',
  ];
  

  useEffect(() => {
    axios.get('http://localhost:8080/api/pastValues', {
      headers: { 'x-access-token': localStorage.getItem('token')}
    })
      .then((res) => {
        setPastValues(res.data.values);
      })
  },[]);

  useEffect(() => {
    let totalPrice = 0;
    for (const item of formData.states) {
      totalPrice += item.cost; 
    }
    setTotal(totalPrice);
  }, [formData.states]);

  useEffect(() => {
    if (total < 1 || isNaN(total)) setHasError(true);
  }, [total]);

  const calculateCost = (type, value = 0) => {
    if (!value) {
      setHasError(true);
      return 0
    };

    const pastVal = pastValues[type];
    const typeRate = rates.find((elem) => elem.latinName === type);

    if (pastVal) {
      if ((typeRate.price * (value - pastVal)) < 0 || value <= pastVal) setHasError(true);
      else setHasError(false);
      return typeRate.price * (value - pastVal);
    }
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

        if (newItem.type && newItem.value) {
          const rate = rates.find((elem) => elem.latinName === newItem.type);
          if (rate.atomic) {
            newItem.cost = rate.price;
            newItem.atomic = true;
          } else {
            newItem.cost = newItem.type && newItem.value ? calculateCost(newItem.type, newItem.value) : 0;
          }
        }

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
      newArr.pop();

      return {
        ...prev,
        'states': newArr
      };
    })
  }

  const handleSublit = () => {
    let errorsCount = 0;
    for (let i = 0; i < formData.states.length; i++) {
      const element = formData.states[i];
      if (element.type.length < 1) errorsCount = errorsCount + 1;
    }

    if (errorsCount > 0 && total < 1) {
      setHasError(true);
      setShowPayment(false);
    } else {
      setHasError(false);
      setShowPayment(true);
    }
  }

  const handlePayment = () => {
    axios.post('http://localhost:8080/api/invoices',
        {
          invoices: formData.states,
        },
        {
          headers: { 'x-access-token': localStorage.getItem('token') },
        }
      )
      .then(() => {
        navigate('/');
      })
  };

  return (
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} justify={'center'}>
        <Stack spacing={4} w={'full'} maxW={'md'}>
          <PriceTable rates={rates}/>

          <Heading fontSize={'2xl'}>Оплата счета</Heading>
          <FormControl id="text">
            <FormLabel>Полное имя</FormLabel>
            <Input isDisabled value={`${firstName} ${lastName}`} type="text" onChange={(e) => updateForm('name', e.target.value)}/>
          </FormControl>
          <FormControl id="text">
            <FormLabel>Адрес</FormLabel>
            <Input isDisabled value={`${address}`} type="text" onChange={(e) => updateForm('addres', e.target.value)}/>
          </FormControl>

          {formData.states.map((item, id) => {
            return (
              <React.Fragment key={`stack-${id}`}>
                <FormField
                  allowedSelectors={allowedSelectors} 
                  item={item} 
                  id={id} 
                  updateForm={updateForm}
                  pastValues={pastValues}
                  formData={formData}
                />
              </React.Fragment>
            );
          }
          )}

          <Flex justify='space-between'>
            <Button colorScheme='blue' maxW='190' onClick={addField}>Добавить показание</Button>
            {formData.states.length > 1 && (
              <Button colorScheme='red' maxW='190' onClick={removeField}>Удалить запись</Button>
            )}
          </Flex>

          {(!showPayment || hasError) && (
            <Button 
              isDisabled={total < 1 || isNaN(total)}
              colorScheme={'blue'} 
              variant={'solid'} 
              onClick={handleSublit}>
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