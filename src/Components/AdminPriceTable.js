import React, {useState, useEffect} from 'react';
import {
  Button,
  TableContainer,
  Table,
  Tr,
  Td,
  TableCaption,
  Thead,
  Th,
  Tbody,
  Editable,
  EditablePreview,
  EditableInput,
  Flex
} from '@chakra-ui/react';
import axios from 'axios';

const PriceTable = () => {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/rates', {
      headers: {
        'x-access-token': localStorage.getItem('token'),
      },
      params: {
        latinName: '',
        price: ''
      }
    })
      .then((res) => {
        console.log("OK");
    })
  }, []);

  const updateFields = (type, value) => {

  }

  const pusData = () => {
    axios.put('http://localhost:8080/api/rates', {
      headers: {
        'x-access-token': localStorage.getItem('token'),
      }
    })
      .then((res) => {
        setFields(res.data.rates);
    })
  }

  return (
    <Flex direction="column">
      <TableContainer>
        <Table variant='simple'>
          <TableCaption>Прейскурант</TableCaption>
          <Thead>
            <Tr>
              <Th>Наименование</Th>
              <Th isNumeric>Стоимость за ед.</Th>
            </Tr>
          </Thead>
          <Tbody>
            {fields.map(item => {
              const {_id, price, cyrillicName} = item;
              return (
                <Tr key={_id}>
                  <Td>
                    <Editable maxW='100px' defaultValue={cyrillicName}>
                      <EditablePreview />
                      <EditableInput />
                    </Editable>
                  </Td>
                  <Td isNumeric>
                    <Editable maxW='120px' defaultValue={price}>
                      <EditablePreview />
                      <EditableInput />
                    </Editable>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Button my='20px' colorScheme='blue'>Внести изменения</Button>
    </Flex>
  );
}

export default PriceTable;