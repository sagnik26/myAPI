const { listeners } = require('../models/tourModel')
const Tour = require('../models/tourModel')


exports.getAllTours = async (req, res) => {
    try {
        console.log(req.query)
        // BUILD QUERY
        // 1A) Filtering
        const queryObj = {...req.query}
        const excludeFields = ['page', 'sort', 'limit', 'fields']
        excludeFields.forEach(el => delete queryObj[el])

        // 1B) Advanced  Filtering
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        console.log(JSON.parse(queryStr))

        // { difficulty: 'easy', duration: { $gte: 5 } }
        // { duration: { gte: '5' }, difficulty: 'easy' }
        // gte, gt, lte, lt

        // const query = Tour.find(queryObj)
        let query = Tour.find(JSON.parse(queryStr))

        // 2) Sorting
        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            console.log(sortBy)
            query = query.sort(sortBy)  
        } else {
            query = query.sort('-createdAt')
        }

        // 3) Field limiting
        if(req.query.fields) {
            const fields = req.query.fields.split(',').join(' ')
            query = query.select(fields)
        } else {
            query = query.select('-__v')
        }

        // EXECUTE QUERY
        const tours = await query

        res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            results: tours.length,
            data: {
                tours
            }
        })
    } catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id)

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }


}

exports.postTour = async (req, res) => {
    try {
    // const newTour = new Tour({})
    // newTour.save()
    console.log(req.body)
    const newTour = await Tour.create(req.body)

    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    })
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id)

        res.status(204).json({
            status: 'success',
            data: null
    });
    } catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }

}

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: 'success',
            data: {
              tour
            }
    });
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    } 

}
