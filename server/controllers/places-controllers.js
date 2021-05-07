const HttpError = require('../models/http-error');

const DUMMY_PLACE = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        imageUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
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
        imageUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
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

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;