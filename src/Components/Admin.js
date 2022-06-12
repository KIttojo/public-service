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
  Heading,
  Tag,
  Divider,
  Flex
} from '@chakra-ui/react';
import PriceTable from './AdminPriceTable';

const HistoryCard = ({address, cost, createdAt, email, firstname, lastname, type, value}) => { 
  return (
    <Box p='4' my='3' maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
      <Heading as='h4' size='md'>
        Пользователь
      </Heading>
      <UnorderedList>
        <ListItem>{`${firstname} ${lastname}`}</ListItem>
        <ListItem>{address}</ListItem>
        <ListItem>{email}</ListItem>
      </UnorderedList>
      <Divider my='5'/>
      <Heading as='h4' size='md'>
        Информация
      </Heading>
      <UnorderedList>
        <ListItem>{type}</ListItem>
        <ListItem>{value}</ListItem>
      </UnorderedList>
      <Box mt='4'>
        <Stat>
          <StatLabel>К оплате</StatLabel>
          <StatNumber>{cost}₽</StatNumber>
          <StatHelpText>Дата: {createdAt}</StatHelpText>
        </Stat>
      </Box>
      <Tag colorScheme='green'>Оплачено</Tag>
      {/* <Tag colorScheme='yellow'>Ожидает оплаты</Tag> */}
    </Box>
  );
};

const Admin = () => {
  const [items, setItems] = useState([1, 2, 3, 4]);

  useEffect(() => {
    axios.get('https://backend-public-service.herokuapp.com/api/invoices', {
      headers: { 'x-access-token': localStorage.getItem('token')},
    })
      .then(res => setItems(res.data))
  }, []);
  return (
    <Flex justify={'space-around'}>
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
              value={item.value}/>
          </React.Fragment>
        })}
      </Box>
      <PriceTable />
    </Flex>
  );
}

export default Admin;