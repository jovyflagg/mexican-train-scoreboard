"use client"
import React, { useContext } from 'react'
import TodoDetails from '../../components/TodoDetails/TodoDetails'
import { useParams } from 'next/navigation'
import { TodoContext } from '../../../../context/TodoContext'

const page =  () => {
  const params = useParams()
  
  return (
    <TodoDetails _id={params._id}/>
  )
}

export default page