const express = require('express');
const router = express.Router();
const Booking = require('./../models/booking');
const { jwtMiddleware } = require('./../jwt');

// Create a new booking (public endpoint for guests)
router.post('/', async (req, res) => {
  try {
    const bookingData = req.body;
    
    // Check if table is available for the requested date and time
    const existingBooking = await Booking.findOne({
      tableNumber: bookingData.tableNumber,
      bookingDate: bookingData.bookingDate,
      bookingTime: bookingData.bookingTime,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(400).json({ error: 'Table is already booked for this time slot' });
    }

    const newBooking = new Booking(bookingData);
    const response = await newBooking.save();
    
    console.log('Booking created successfully');
    res.status(201).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all bookings (admin/staff only)
router.get('/', jwtMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    console.log('Bookings fetched successfully');
    res.status(200).json(bookings);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's bookings
router.get('/my-bookings', jwtMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get bookings by email (for guest bookings)
router.get('/guest/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const bookings = await Booking.find({ customerEmail: email }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update booking status (staff only)
router.put('/:id/status', jwtMiddleware, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;
    
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    console.log('Booking status updated');
    res.status(200).json(updatedBooking);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update payment status
router.put('/:id/payment', async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { paymentStatus, paymentMethod } = req.body;
    
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { paymentStatus, paymentMethod, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    console.log('Payment status updated');
    res.status(200).json(updatedBooking);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel booking
router.delete('/:id', async (req, res) => {
  try {
    const bookingId = req.params.id;
    
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'cancelled', updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    console.log('Booking cancelled');
    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available tables for a specific date and time
router.get('/available-tables', async (req, res) => {
  try {
    const { date, time } = req.query;
    
    if (!date || !time) {
      return res.status(400).json({ error: 'Date and time are required' });
    }

    // Get all booked tables for the specified date and time
    const bookedTables = await Booking.find({
      bookingDate: date,
      bookingTime: time,
      status: { $in: ['pending', 'confirmed'] }
    }).select('tableNumber');

    const bookedTableNumbers = bookedTables.map(booking => booking.tableNumber);
    
    // Assuming we have tables 1-20
    const allTables = Array.from({ length: 20 }, (_, i) => i + 1);
    const availableTables = allTables.filter(table => !bookedTableNumbers.includes(table));

    res.status(200).json({ availableTables, bookedTables: bookedTableNumbers });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;