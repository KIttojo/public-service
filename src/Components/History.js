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

const HistoryCard = ({address, cost, createdAt, type, value, rates}) => {
  return (
    <Box p='4' my='3' maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
      <UnorderedList>
        <ListItem>Адрес: {address}</ListItem>
        <ListItem>Тип показания: {type}</ListItem>
        {
          rates && !rates.filter((elem) => elem.latinName === type)[0]?.atomic && <ListItem>Измерения {value}</ListItem>
        }
        <ListItem>Оплачено</ListItem>
      </UnorderedList>
      <Box mt='4'>
        <Stat>
          <StatLabel>Итого оплачено</StatLabel>
          <StatNumber>{cost}₽</StatNumber>
          <StatHelpText>Дата: {createdAt}</StatHelpText>
        </Stat>
      </Box>
    </Box>
  );
};

const History = ({user, rates}) => {
  const [items, setItems] = useState([1, 2, 3, 4]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/invoices', {
      headers: { 'x-access-token': localStorage.getItem('token')},
      params: {
        role: user.role,
        email: 'admin1@admin.com'
      }
    })
      .then(res => setItems(res.data))
  }, []);

  return (
    <Box>
      <Heading my='5'>История платежей</Heading>
      {items.map((item, index) => {
        return <React.Fragment key={index}>
          <HistoryCard 
            address={item.address} 
            cost={item.cost} 
            createdAt={item.created_at} 
            email={item.email} 
            firstname={item.firstname} 
            lastname={item.lastname} 
            type={item.type} 
            value={item.value}
            rates={rates}/>
        </React.Fragment>
      })}
    </Box>
  );
}

export default History;