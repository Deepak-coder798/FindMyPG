const Property = require('../../models/owners/Property.Model');
const Staff = require('../../models/owners/Staff.Model')// updated model
const Room = require('../../models/owners/Room.Model');
const Tenant = require('../../models/owners/Tenant.Model');



exports.addProperty = async (req, res) => {
  try {
    const {
      type,
      name,
      address,
      city,
      description,
      rent,
      deposit,
      facilities,
      images,
      coordinates,
      pgDetails,
      flatDetails,
      totalRooms,
      availableRooms,
    } = req.body;

    if (!type || !name || !address || !city || !rent || !deposit || !coordinates) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      return res.status(400).json({ message: 'Coordinates must be [longitude, latitude]' });
    }

    // PG-specific validation
    if (type === 'pg') {
      if (!pgDetails || !pgDetails.gender) {
        return res.status(400).json({ message: 'PG details are required for PG type' });
      }
      if (!totalRooms || totalRooms < 1) {
        return res.status(400).json({ message: 'Total rooms must be greater than 0 for PG' });
      }
    }

    // Flat-specific validation
    if (type === 'flat') {
      if (!flatDetails || typeof flatDetails.bhk !== 'number') {
        return res.status(400).json({ message: 'Flat BHK details are required for flat' });
      }
    }

    const newProperty = new Property({
      ownerId: req.user.id, // From auth middleware
      type,
      name,
      address,
      city,
      description,
      rent,
      deposit,
      totalRooms: type === 'pg' ? totalRooms : undefined,
      availableRooms: type === 'pg' ? availableRooms : undefined,
      facilities,
      images,
      locationCoords: {
        type: 'Point',
        coordinates: coordinates.map(Number)
      },
      pgDetails: type === 'pg' ? pgDetails : undefined,
      flatDetails: type === 'flat' ? flatDetails : undefined
    });

    await newProperty.save();

    res.status(201).json({
      message: `${type.toUpperCase()} added successfully`,
      property: newProperty
    });

  } catch (error) {
    console.error('Error adding property:', error);
    res.status(500).json({ message: 'Server error while creating property' });
  }
};


// controllers/roomController.js

exports.addRoom = async (req, res) => {
  try {
    const { propertyId, roomNumber, sharingType, floorNumber } = req.body;

    // Validate
    if (!propertyId || !roomNumber || !sharingType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.type !== 'pg') {
      return res.status(400).json({ message: 'Rooms can only be added to PG properties' });
    }

    // Check current room count
    const existingRoomCount = await Room.countDocuments({ pgId: propertyId });
    if (existingRoomCount >= property.totalRooms) {
      return res.status(400).json({ message: 'Cannot add more rooms than totalRooms' });
    }

    const roomCapacity = {
      single: 1,
      double: 2,
      triple: 3,
      four: 4,
    }[sharingType];

    const newRoom = new Room({
      pgId: propertyId,
      roomNumber,
      sharingType,
      capacity: roomCapacity,
      floorNumber,
      occupants: []
    });

    await newRoom.save();

    res.status(201).json({ message: 'Room added', room: newRoom });

  } catch (error) {
    console.error('Error adding room:', error);
    res.status(500).json({ message: 'Server error while adding room' });
  }
};





exports.addTenant = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      gender,
      age,
      passportImage,
      documents,
      rent,
      deposit,
      pgId,
      roomId,
      moveInDate,
      moveOutDate,
    } = req.body;

    // Fetch the room to check capacity and current occupancy
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    if (room.occupants.length >= room.capacity) {
      return res.status(400).json({ message: 'Room is already full' });
    }

    // Assign bed number based on current count
    const bedNumber = room.occupants.length + 1;

    const newTenant = new Tenant({
      fullName,
      email,
      phone,
      gender,
      age,
      passportImage,
      documents,
      rent,
      deposit,
      pgId,
      roomId,
      moveInDate,
      moveOutDate,
      ownerId: req.user.id // from auth middleware
    });

    await newTenant.save();

    // Add tenant to room
    room.occupants.push({
      tenantId: newTenant._id,
      bedNumber
    });
    await room.save();

    res.status(201).json({
      message: 'Tenant added successfully',
      tenant: newTenant
    });

  } catch (error) {
    console.error('Error adding tenant:', error);
    res.status(500).json({ message: 'Server error while adding tenant' });
  }
};


exports.getTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find({ ownerId: req.user.id })
      .populate('pgId', 'name address')
      .populate('roomId', 'roomNumber sharingType');

    res.status(200).json({
      message: 'Tenants fetched successfully',
      tenants
    });

  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).json({ message: 'Server error while fetching tenants' });
  }
};







// exports.getPGs = async (req, res) => {
//   try {
//     // Find all PGs where the ownerId matches the logged-in user
//     const pgs = await PG.find({ ownerId: req.user.id });

//     res.status(200).json({
//       message: 'PGs fetched successfully!',
//       total: pgs.length,
//       data: pgs
//     });
//   } catch (error) {
//     console.error('Error fetching PGs:', error);
//     res.status(500).json({ message: 'Server error while fetching PGs' });
//   }
// };


// exports.updatePG = async (req, res) => {
//   try {
//     const { pgId } = req.params;

//     // Optional: Allow locationCoords update separately
//     if (req.body.coordinates && req.body.coordinates.length === 2) {
//       req.body.locationCoords = {
//         type: 'Point',
//         coordinates: req.body.coordinates.map(Number)
//       };
//     }

//     // Avoid manual modification of locationCoords via raw request unless provided intentionally
//     const updateFields = { ...req.body };
//     delete updateFields.coordinates;

//     const updatedPG = await PG.findOneAndUpdate(
//       { _id: pgId, ownerId: req.user.id },
//       updateFields,
//       { new: true }
//     );

//     if (!updatedPG) {
//       return res.status(404).json({ message: 'PG not found or unauthorized' });
//     }

//     res.status(200).json({
//       message: 'PG updated successfully!',
//       pg: updatedPG
//     });

//   } catch (error) {
//     console.error('Error updating PG:', error);
//     res.status(500).json({ message: 'Server error while updating PG' });
//   }
// };


// exports.getPGsNearby = async (req, res) => {
//   const { lat, lng, radius } = req.query;

//   // Convert km to meters (Mongo uses meters)
//   const distanceInMeters = radius * 1000;

//   const pgs = await PG.find({
//     locationCoords: {
//       $near: {
//         $geometry: {
//           type: 'Point',
//           coordinates: [parseFloat(lng), parseFloat(lat)]
//         },
//         $maxDistance: distanceInMeters
//       }
//     }
//   });

//   res.json(pgs);
// };




exports.addStaff  = async (req, res) => {
  try {
    const staff = new Staff(req.body);
    await staff.save();
    res.status(201).json({ success: true, message: 'Staff added successfully', staff });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add staff', error });
  }
};

// Get all staff by PG Owner ID
exports.getStaffByOwnerId = async (req, res) => {
  try {
    const staffList = await Staff.find({ pgOwnerId: req.params.pgOwnerId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, staff: staffList });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch staff by owner ID', error });
  }
};

// Get all staff by PG ID
exports.getStaffByPgId = async (req, res) => {
  try {
    const staffList = await Staff.find({ pgId: req.params.pgId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, staff: staffList });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch staff by PG ID', error });
  }
};

// Get single staff by Staff ID
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.staffId);
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
    res.status(200).json({ success: true, staff });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch staff by ID', error });
  }
};
