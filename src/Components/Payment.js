import React, {useState} from 'react';
import {
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
} from '@chakra-ui/react';

export default function Payment() {
  const [states, setStates] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    addres: '',
    states: []
  });

  console.log("FORM=", formData);

  const updateForm = (type, value, key) => {
    setFormData(prev => {
      if (type === 'states') {
        const oldStates = prev.states;
        const newStates = oldStates.push({key, value});
        return {
          ...prev,
          [type] : newStates
        }
      }

      return {...prev, [type] : value}
    });
  }

  return (
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} justify={'center'}>
        <Stack spacing={4} w={'full'} maxW={'md'}>
          <Heading fontSize={'2xl'}>Оплата счета</Heading>
          <FormControl id="text">
            <FormLabel>Полное имя</FormLabel>
            <Input type="text" onChange={(e) => updateForm('name', e.target.value)}/>
          </FormControl>
          <FormControl id="text">
            <FormLabel>Адрес</FormLabel>
            <Input type="text" onChange={(e) => updateForm('addres', e.target.value)}/>
          </FormControl>

          <Stack
            direction={{ base: 'column', sm: 'row' }}
            align={'start'}
            justify={'space-between'}>
            <FormControl>
              <FormLabel htmlFor='country'>Тип показания</FormLabel>
              <Select id='country' placeholder='Выберите тип' onChange={(e) => updateForm('states', e.target.value, 'first-state')}>
                <option>Газ</option>
                <option>Электричество</option>
                <option>Вода</option>
              </Select>
            </FormControl>
            <FormControl maxW='140'>
              <FormLabel htmlFor='amount'>Значение</FormLabel>
              <NumberInput max={1000000} min={1}>
                <NumberInputField id='amount' />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </Stack>

          <Button colorScheme='blue' maxW='190'>Добавить показание</Button>

          <Button colorScheme={'blue'} variant={'solid'}>
            Ввести реквизиты
          </Button>
          
        </Stack>
      </Flex>
    </Stack>
  );
}