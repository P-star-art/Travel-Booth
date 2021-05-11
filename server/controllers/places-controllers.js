const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const { Schema } = require('mongoose');
const User = require('../models/user');
    


const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;

    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('Could not find a place', 500);
        return next(error);
    }

    if (!place) {
        const error = new HttpError('Could not find a place', 404);
        return next(error);
    }
    res.json({ place: place.toObject({ getters: true }) });
}

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let userPlaces;

    try {
        userPlaces = await Place.find({ creator: userId });
    } catch (err) {
        const error = new HttpError('Could not find a place', 500);
        return next(error);
    }


    if (userPlaces.length === 0) {
        return next(new HttpError('Could not find a user place', 404));
    }
    res.json({ userPlaces: userPlaces.map(place => place.toObject({ getters: true })) });
}

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Please provide valid inputs', 422));
    }

    const { title, description, address, creator } = req.body;

    const coordinates = getCoordsForAddress(address);

    const createdPlace = new Place({
        title,
        description,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
        location: coordinates,
        address,
        creator
    });

    let user;

    try {
        user = await User.findById(creator);
    } catch (error) {
        return next(new HttpError('Creating place failed', 500))
    }

    if (!user) {
        return next(new HttpError('Could not find an user',404));
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({ session: sess });
        user.places.push(createdPlace);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Creating place failed', 500);
        return next(error);
    }

    res.status(201).json({ place: createdPlace });

}

const updatePlace = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Please provide valid inputs', 422));
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;

    let updatedPlace;

    try {
        updatedPlace = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('Could not find a place', 500);
        return next(error);
    }

    updatedPlace.title = title;
    updatedPlace.description = description;

    try {
        await updatedPlace.save();
    } catch (err) {
        const error = new HttpError('Updating place failed', 500);
        return next(error);
    }

    res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
}

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;

    try {
        place = await Place.findById(placeId).populate('creator');
    } catch (err) {
        const error = new HttpError('Could not find a place', 500);
        return next(error);
    }

    if (!place) {
        return next(new HttpError('could not find a place', 404));
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({ session: sess });
        place.creator.places.pull(place);
        await place.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Deleting place failed', 500);
        return next(error);
    }

    res.status(200).json({ message: "deleted place" });
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;