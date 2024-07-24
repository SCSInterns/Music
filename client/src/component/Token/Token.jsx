import React from 'react'

function Token() {
  return (
    sessionStorage.getItem('accesstoken')
  )
}

export default Token