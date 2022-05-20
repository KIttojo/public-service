import React, {useState, useEffect} from 'react';
import {
  Select,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack,
} from '@chakra-ui/react';

const FormField = ({item, id, updateForm, pastValues, formData}) => {
  const [fieldData, setFieldData] = useState(1);
  console.log("item=", item)

  useEffect(() => {
    const type = formData.states[id].type;
    const prevCount = pastValues[type];

    setFieldData(prevCount);
  }, [updateForm]);

  return (
    <>
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
            <option >Домофон</option>
          </Select>
        </FormControl>

        <FormControl maxW='140'>
          <FormLabel htmlFor='amount'>Значение</FormLabel>
          <NumberInput 
            defaultValue={0}
            max={100000}
            min={fieldData || 1}
            onChange={val => updateForm('states', val, 'value', id)}>
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

      {fieldData && (
        <NumberInput 
          isDisabled={true}
          value={`За прошлый месяц по счетчику ${fieldData}`}>
          <NumberInputField id='amount'/>
        </NumberInput>
      )}
    </>
  );
}

export default FormField;
