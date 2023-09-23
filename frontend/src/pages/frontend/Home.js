import React, { useEffect } from 'react'
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import Signup from "../../components/AuthComponents/Signup";
import Login from "../../components/AuthComponents/Login";
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../context/ChatContext';


export default function Home() {


  const navigator = useNavigate()
  const {user} = useChat();

  useEffect(()=>{
    if(user.name){
      navigator('/chats')
    }

  },[navigator,user])


  return (
    <>
    <Container maxW='xl' centerContent>
      <Box
       display='flex'
       justifyContent={'center'}
       p={3}
       bg={'white'}
       w={'100%'}
       m={'40px 0 15px 0'}
       borderRadius={'lg'}
       borderWidth={'1px'}
       alignItems={'center'}
      >
      <Text fontSize={'4xl'} fontWeight={'bold'}>ChitChat</Text>
      </Box>
      <Box
      bg={'white'}
      w={'100%'}
      p={4}
      borderRadius={'lg'}
      borderWidth={'1px'}

      >


<Tabs variant='soft-rounded' colorScheme='gray'>
  <TabList mb={'1rem'} >
    <Tab w={'50%'}>Login</Tab>
    <Tab w={'50%'}>SignUp</Tab>
  </TabList >
  <TabPanels>
    <TabPanel>
      <Login />
    </TabPanel>
    <TabPanel>
      <Signup />
    </TabPanel>
  </TabPanels>
</Tabs>


      </Box>
    </Container>
    </>
  )
}
