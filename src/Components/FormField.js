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

const FormField = ({item, id, updateForm, pastValues, formData, allowedSelectors}) => {
  const [fieldData, setFieldData] = useState(1);

  useEffect(() => {
    const type = formData.states[id].type;
    const prevCount = pastValues[type] || 1;
    if (prevCount) {
      setFieldData(prevCount);
    } else {
      setFieldData(1);
    }
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
              {allowedSelectors.map((item, id) => {
                if (!formData.states.find((state) => state.type === item)){
                  return <option key={`selector-${id}`}>{item}</option>
                } else {
                  return <option key={`selector-${id}`} disabled>{item}</option>
                }
              })}
            </Select>
        </FormControl>
        <FormControl maxW='140'>
          <FormLabel htmlFor='amount'>Значение</FormLabel>
          <NumberInput
            isDisabled={item?.atomic}
            value={item?.atomic ? 1 : undefined} 
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

      {(fieldData && !item.atomic) && (
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
