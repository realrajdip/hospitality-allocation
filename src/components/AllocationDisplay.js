
import React from 'react';

const AllocationDisplay = ({ allocations }) => {
  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Group ID</th>
          <th>Hostel Name</th>
          <th>Room Number</th>
          <th>Members Allocated</th>
        </tr>
      </thead>
      <tbody>
        {allocations.map((allocation, index) => (
          <tr key={index}>
            <td>{allocation.groupId}</td>
            <td>{allocation.hostelName}</td>
            <td>{allocation.roomNumber}</td>
            <td>{allocation.membersAllocated.join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AllocationDisplay;
