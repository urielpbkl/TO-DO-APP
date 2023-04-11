import React from 'react'
import '../CSS/ListHeader.css'

const ListHeader = () => {

  const signOut = () => {
    console.log('sign out')
  }

  return (
    <div className='list-header-container'>
      <h1>To do list</h1>
      <div className='button-container'>
        <button className='create'>ADD NEW</button>
        <button
          className='signout'
          onClick={signOut}
        >
          SIGN OUT
        </button>
      </div>

    </div>
  )
}

export default ListHeader
