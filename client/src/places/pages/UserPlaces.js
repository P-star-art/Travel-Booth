import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import PlaceList from '../components/PlaceList';
import { useHttpClient } from '../../shared/hooks/http-hook';

const UserPlaces = () => {

  const userId = useParams().userId;
  const [loadedPlaces, setLoadedPlaces] = useState()
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:5000/api/places/user/${userId}`)
        setLoadedPlaces(responseData.userPlaces);
      } catch (err) { }

    }

    fetchPlaces();

  }, [sendRequest, userId])

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <div className="center"><LoadingSpinner /></div>}
      {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} />}
    </React.Fragment>
  );
};

export default UserPlaces;
