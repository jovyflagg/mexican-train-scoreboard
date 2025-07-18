"use client"
import React from 'react'
import TodoDetails from '../../components/TodoDetails/TodoDetails'
import { useParams } from 'next/navigation'

const page = () => {
  const params = useParams()
  
  return (
    <TodoDetails _id={params._id}/>
  )
}

export default page