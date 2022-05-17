import React from 'react';
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
  Divider 
} from '@chakra-ui/react';

const HistoryCard = () => { 
  return (
    <Box p='4' my='3' maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
      <Heading as='h4' size='md'>
        Пользователь
      </Heading>
      <UnorderedList>
        <ListItem>Имя Фамилия</ListItem>
        <ListItem>Адрес проживания</ListItem>
      </UnorderedList>
      <Divider my='5'/>
      <Heading as='h4' size='md'>
        Информация
      </Heading>
      <UnorderedList>
        <ListItem>Адрес</ListItem>
        <ListItem>Тип показания</ListItem>
        <ListItem>Измерения</ListItem>
      </UnorderedList>
      <Box mt='4'>
        <Stat>
          <StatLabel>К оплате</StatLabel>
          <StatNumber>0.00₽</StatNumber>
          <StatHelpText>Дата: 12.12.2022</StatHelpText>
        </Stat>
      </Box>
      <Tag colorScheme='green'>Оплачено</Tag>
      <Tag colorScheme='yellow'>Ожидает оплаты</Tag>
    </Box>
  );
};

const Admin = () => {
  const items = [1, 2, 3, 4];
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

export default Admin;