import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { 
  Box, 
  UnorderedList, 
  ListItem, 
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Heading
} from '@chakra-ui/react';

const HistoryCard = () => {
  return (
    <Box p='4' my='3' maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
      <UnorderedList>
        <ListItem>Адрес</ListItem>
        <ListItem>Тип показания</ListItem>
        <ListItem>Измерения</ListItem>
        <ListItem>Оплачено</ListItem>
      </UnorderedList>
      <Box mt='4'>
        <Stat>
          <StatLabel>Итого оплачено</StatLabel>
          <StatNumber>0.00₽</StatNumber>
          <StatHelpText>Дата: 12.12.2022</StatHelpText>
        </Stat>
      </Box>
    </Box>
  );
};

const History = ({user}) => {
  const [items, setItems] = useState([1, 2, 3, 4]);
  console.log('1111', items)

  useEffect(() => {
    axios.get('http://localhost:8080/api/invoices', {
      headers: { 'x-access-token': localStorage.getItem('token')},
      params: {
        role: user.role,
        email: 'admin1@admin.com'
      }
    })
      .then(res => setItems(res.data))
      .catch(err => console.log(err))
  }, []);

  return (
    <Box>
      <Heading my='5'>История платежей</Heading>
      {items.map((item, index) => {
        return <React.Fragment key={index}>
          <HistoryCard />
        </React.Fragment>
      })}
    </Box>
  );
}

export default History;