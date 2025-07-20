const PG = require('../../models/owners/PG.Model');
const Staff = require('../../models/owners/Staff.Model')

exports.addPG = async (req, res) => {
  try {
    const { name, location, city, gender, availableRooms, totalRooms, facilities, images, coordinates } = req.body;

    if (!coordinates || coordinates.length !== 2) {
      return res.status(400).json({ message: 'Coordinates (longitude, latitude) are required' });
    }

    const newPG = new PG({
      name,
      location,
      city,
      gender,
      availableRooms,
      totalRooms,
      facilities,
      images,
      ownerId: req.user.id, // From auth middleware
      locationCoords: {
        type: 'Point',
        coordinates: coordinates.map(Number) // [lng, lat]
      }
    });

    await newPG.save();

    res.status(201).json({
      message: 'PG created successfully!',
      pg: newPG
    });

  } catch (error) {
    console.error('Error adding PG:', error);
    res.status(500).json({ message: 'Server error while creating PG' });
  }
};



exports.getPGs = async (req, res) => {
  try {
    // Find all PGs where the ownerId matches the logged-in user
    const pgs = await PG.find({ ownerId: req.user.id });

    res.status(200).json({
      message: 'PGs fetched successfully!',
      total: pgs.length,
      data: pgs
    });
  } catch (error) {
    console.error('Error fetching PGs:', error);
    res.status(500).json({ message: 'Server error while fetching PGs' });
  }
};


exports.updatePG = async (req, res) => {
  try {
    const { pgId } = req.params;

    // Optional: Allow locationCoords update separately
    if (req.body.coordinates && req.body.coordinates.length === 2) {
      req.body.locationCoords = {
        type: 'Point',
        coordinates: req.body.coordinates.map(Number)
      };
    }

    // Avoid manual modification of locationCoords via raw request unless provided intentionally
    const updateFields = { ...req.body };
    delete updateFields.coordinates;

    const updatedPG = await PG.findOneAndUpdate(
      { _id: pgId, ownerId: req.user.id },
      updateFields,
      { new: true }
    );

    if (!updatedPG) {
      return res.status(404).json({ message: 'PG not found or unauthorized' });
    }

    res.status(200).json({
      message: 'PG updated successfully!',
      pg: updatedPG
    });

  } catch (error) {
    console.error('Error updating PG:', error);
    res.status(500).json({ message: 'Server error while updating PG' });
  }
};


exports.getPGsNearby = async (req, res) => {
  const { lat, lng, radius } = req.query;

  // Convert km to meters (Mongo uses meters)
  const distanceInMeters = radius * 1000;

  const pgs = await PG.find({
    locationCoords: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        $maxDistance: distanceInMeters
      }
    }
  });

  res.json(pgs);
};

exports.addStaff = async (req, res) => {
  try {
    const { name, phone, email, role, pgId,pgOwnerId } = req.body;

    const newStaff = new Staff({
      name,
      phone,
      email,
      role,
      pgId, 
      pgOwnerId,
    });

    const saved = await newStaff.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add staff', details: err.message });
  }
}

exports.getStaffByOwnerId = async (req, res) => {
  try {
    const staff = await Staff.find({ pgOwnerId: req.params.ownerId });
    if(staff?.length>0)
    res.status(200).json({ staff });
    else{
      res.status(404).json({message:"No Staff Member Found!"});
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching staff", error: err });
  }
}
