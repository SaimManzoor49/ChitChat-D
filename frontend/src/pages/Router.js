import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './frontend/Home'
import Chats from './frontend/Chats'

export default function Router() {
  return (
    <>
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/chats' element={<Chats />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}
