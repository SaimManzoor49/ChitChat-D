import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

export default function ChatLoading() {
  return (
    <>
    <Stack>
        <Skeleton height={'45px'} rounded={"8px"} w={"94%"} ms={'8px'}/>
        <Skeleton height={'45px'} rounded={"8px"} w={"94%"} ms={'8px'}/>
        <Skeleton height={'45px'} rounded={"8px"} w={"94%"} ms={'8px'}/>
        <Skeleton height={'45px'} rounded={"8px"} w={"94%"} ms={'8px'}/>
        <Skeleton height={'45px'} rounded={"8px"} w={"94%"} ms={'8px'}/>
        <Skeleton height={'45px'} rounded={"8px"} w={"94%"} ms={'8px'}/>
        <Skeleton height={'45px'} rounded={"8px"} w={"94%"} ms={'8px'}/>
    </Stack>
    
    </>
  )
}
