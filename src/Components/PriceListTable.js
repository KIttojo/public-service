import {
  Text,
  TableContainer,
  Table,
  Tr,
  Td,
  TableCaption,
  Thead,
  Th,
  Tbody
} from '@chakra-ui/react';

const PriceTable = ({rates}) => {
  return (
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
          {rates.map(item => {
            const {_id, price, cyrillicName} = item;
            return (
              <Tr key={_id}>
                <Td>{cyrillicName}</Td>
                <Td isNumeric>{price}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default PriceTable;