const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');


let DUMMY_PLACE = [
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
        creator: 'u1'
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

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const userPlaces = DUMMY_PLACE.filter(u => {
        return u.creator === userId;
    })
    if (userPlaces.length === 0) {
        return next(new HttpError('Could not find a user place', 404));
    }
    res.json({ userPlaces });
}

const createPlace = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Please provide valid inputs', 422);
    }

    const { title, description, address, creator } = req.body;

    const coordinates = getCoordsForAddress(address);

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

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Please provide valid inputs', 422);
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;

    const updatedPlace = { ...DUMMY_PLACE.find(p => p.id === placeId) };
    const placeIndex = DUMMY_PLACE.find(p => p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMY_PLACE[placeIndex] = updatedPlace;

    res.status(200).json({ place: updatedPlace });
}

const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;
    if (!DUMMY_PLACE.find(p => p.id === placeId)) {
        throw new HttpError('Could not find a place', 404);
    }
    DUMMY_PLACE = DUMMY_PLACE.filter(p => p.id !== placeId);

    res.status(200).json({ message: "deleted place" });
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;