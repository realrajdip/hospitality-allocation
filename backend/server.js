// server.js
const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const cors = require('cors')

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors())

app.post('/api/upload', upload.fields([{ name: 'groupFile' }, { name: 'hostelFile' }]), (req, res) => {
  const groupFile = req.files['groupFile'][0];
  const hostelFile = req.files['hostelFile'][0];

  let groups = [];
  let hostels = [];

  fs.createReadStream(groupFile.path)
    .pipe(csv())
    .on('data', (data) => groups.push(data))
    .on('end', () => {
      fs.createReadStream(hostelFile.path)
        .pipe(csv())
        .on('data', (data) => hostels.push(data))
        .on('end', () => {
          const allocations = allocateRooms(groups, hostels);
          res.json(allocations);
        });
    });
});

const allocateRooms = (groups, hostels) => {
  let allocations = [];
  let hostelMap = {};

  hostels.forEach(hostel => {
    const { 'Hostel Name': hostelName, 'Room Number': roomNumber, Capacity, Gender } = hostel;
    if (!hostelMap[hostelName]) {
      hostelMap[hostelName] = [];
    }
    hostelMap[hostelName].push({ roomNumber, capacity: parseInt(Capacity), gender: Gender, occupants: [] });
  });

  groups.forEach(group => {
    const { 'Group ID': groupId, Members, Gender } = group;
    const numMembers = parseInt(Members);
    const gender = Gender.toLowerCase();
    
    let allocated = false;

    for (let hostelName in hostelMap) {
      if (allocated) break;

      hostelMap[hostelName].forEach(room => {
        if (room.gender === gender && room.capacity >= room.occupants.length + numMembers && !allocated) {
          room.occupants.push(...Array(numMembers).fill(groupId));
          allocations.push({
            groupId,
            hostelName,
            roomNumber: room.roomNumber,
            membersAllocated: Array(numMembers).fill(groupId)
          });
          allocated = true;
        }
      });
    }

    if (!allocated) {
      allocations.push({
        groupId,
        hostelName: 'Unallocated',
        roomNumber: 'N/A',
        membersAllocated: Array(numMembers).fill(groupId)
      });
    }
  });

  return allocations;
};

app.get('/api/download', (req, res) => {
  const allocations = []; // This should be the actual allocations array

  const fields = ['groupId', 'hostelName', 'roomNumber', 'membersAllocated'];
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(allocations);

  res.header('Content-Type', 'text/csv');
  res.attachment('allocation_results.csv');
  res.send(csv);
});

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
