import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'

export default function UserListItem({user,handleFunction}) {



  return (
    <>
    <Box
    onClick={handleFunction}
    cursor={'pointer'}
    bg={"#E8E8EB"}
    _hover={{
        background:"#edf2f7",
        color:"black"
    }}
    height={'45px'} rounded={"8px"} w={"94%"} ms={'8px'}
    display={"flex"}
    alignItems={"center"}
    color={"black"}
    px={3}
    py={2}
    mb={2}
    borderRadius={'lg'}

    >

        <Avatar 
        mr={2}
        size={"sm"}
        cursor={"pointer"}
        name={user.name}
        src={user.pic}
        />
        <Box

        >
            <Text>{user.name}</Text>
            <Text fontSize={'xs'}><b>Email: </b>{user.email}</Text>
        </Box>

    </Box>
    
    </>
  )
}
