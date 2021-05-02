import React from 'react';
import UsersList from '../components/UsersList';

const Users = () => {

  const USERS = [
    {
      id: '1',
      name: 'Pranav',
      image: 'https://expertphotography.com/wp-content/uploads/2018/10/cool-profile-pictures-retouching-1.jpg',
      places: 3
    },
    {
      id: '2',
      name: 'Lahu',
      image: 'https://expertphotography.com/wp-content/uploads/2018/10/cool-profile-pictures-retouching-1.jpg',
      places: 5
    }
  ]

  return (
    <UsersList items={USERS} />
  )
};

export default Users;
