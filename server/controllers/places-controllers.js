const { v4: uuid } = require('uuid');

const HttpError = require('../models/http-error');


const DUMMY_PLACE = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        address: '20 W 34th St, New York, NY 10001',
        location: {
          lat: 40.7484405,
          lng: -73.9878584
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Empire Building',
        description: 'One of the most famous sky scrapers in the world!',
        address: '20 W 34th St, New York, NY 10001',
        location: {
          lat: 40.7484405,
          lng: -73.9878584
        },
        creator: 'u2'
      }
]


const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACE.find(p => {
        return p.id === placeId;
    })
    if (!place) {
        throw new HttpError('Could not find a place', 404);
    }
    res.json({ place });
}

const getPlaceByUserId =  (req, res, next) => {
    const userId = req.params.uid;
    const userPlace = DUMMY_PLACE.find(u => {
        return u.creator === userId;
    })
    if (!userPlace) {
        return next(new HttpError('Could not find a user place', 404));
    }
    res.json({ userPlace });
}

const createPlace = (req, res, next) => {
    const { title, description, coordinates, address, creator } = req.body;

    const createdPlace = {
        id: uuid(),
        title,
        description,
        location: coordinates,
        address,
        creator
    }

    DUMMY_PLACE.push(createdPlace);
    res.status(201).json({ place: createdPlace });

}

const updatePlace = (req, res, next) => {
    const { title, description } = req.body;
    const placeId = req.params.pid;

    const updatedPlace = {...DUMMY_PLACE.find(p => p.id === placeId)};
    const placeIndex = DUMMY_PLACE.find(p => p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMY_PLACE[placeIndex] = updatedPlace;

    res.status(200).json({ place: updatedPlace });
}

const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;
}

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;