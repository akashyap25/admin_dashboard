// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_ENDPOINT = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [editingRows, setEditingRows] = useState([]);

  useEffect(() => {
    axios.get(API_ENDPOINT)
      .then(response => {
        setUsers(response.data);
        setFilteredUsers(response.data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSearch = () => {
    const filtered = users.filter(user =>
      Object.values(user).some(value =>
        value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowSelect = (id) => {
    const index = selectedRows.indexOf(id);
    if (index === -1) {
      setSelectedRows([...selectedRows, id]);
    } else {
      const updatedSelection = [...selectedRows];
      updatedSelection.splice(index, 1);
      setSelectedRows(updatedSelection);
    }
  };

  const handleSelectAll = () => {
    const allIds = filteredUsers.map(user => user.id);
    setSelectedRows(selectedRows.length === allIds.length ? [] : allIds);
  };

  const handleDeleteSelected = () => {
    const updatedUsers = users.filter(user => !selectedRows.includes(user.id));
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setSelectedRows([]);
  };

  const handleEdit = (id) => {
    if (editingRows.includes(id)) {
      // Save the changes and exit edit mode
      setEditingRows(editingRows.filter(rowId => rowId !== id));
      // You may want to send the edited data to a server or update your local state
    } else {
      // Enter edit mode for the specified row
      setEditingRows([...editingRows, id]);
    }
  };

  const handleEditInputChange = (e, id) => {
    // Update the local state with the edited values
    const updatedUsers = users.map(user =>
      user.id === id
        ? { ...user, [e.target.name]: e.target.value }
        : user
    );
    setUsers(updatedUsers);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <div className="mb-4 flex justify-between items-center w-full">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search..."
            className="border p-2 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-blue-500 text-white p-2 rounded-md" onClick={handleSearch}>
            Search
          </button>
        </div>
        <button className="bg-red-500 text-white p-2 rounded-md" onClick={handleDeleteSelected}>
          Delete Selected
        </button>
      </div>

      <table className="w-full bg-white shadow-md rounded-md overflow-hidden">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(user => (
            <tr
              key={user.id}
              className={selectedRows.includes(user.id) ? 'bg-gray-100' : ''}
              onClick={() => handleRowSelect(user.id)}
              style={{ cursor: 'pointer' }}
            >
              <td className="p-2">{user.id}</td>
              <td className="p-2">
                {editingRows.includes(user.id) ? (
                  <input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={(e) => handleEditInputChange(e, user.id)}
                    className="border p-1 rounded-md w-full"
                  />
                ) : (
                  user.name
                )}
              </td>
              <td className="p-2">
                {editingRows.includes(user.id) ? (
                  <input
                    type="text"
                    name="email"
                    value={user.email}
                    onChange={(e) => handleEditInputChange(e, user.id)}
                    className="border p-1 rounded-md w-full"
                  />
                ) : (
                  user.email
                )}
              </td>
              <td className="p-2">
                {editingRows.includes(user.id) ? (
                  <input
                    type="text"
                    name="role"
                    value={user.role}
                    onChange={(e) => handleEditInputChange(e, user.id)}
                    className="border p-1 rounded-md w-full"
                  />
                ) : (
                  user.role
                )}
              </td>
              <td className="p-2">
                <button
                  className={`bg-${editingRows.includes(user.id) ? 'green' : 'blue'}-500 text-white p-1 rounded-md`}
                  onClick={() => handleEdit(user.id)}
                >
                  {editingRows.includes(user.id) ? 'Save' : 'Edit'}
                </button>
                <button
                  className="bg-red-500 text-white p-1 rounded-md ml-1"
                  onClick={() => handleRowSelect(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4 w-full">
        <div>
          <button
            className="bg-blue-500 text-white p-2 rounded-md"
            onClick={() => handlePageChange(1)}
          >
            First Page
          </button>
          <button
            className="bg-blue-500 text-white p-2 rounded-md ml-1"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous Page
          </button>
        </div>
        <div>
          {Array.from({ length: Math.ceil(filteredUsers.length / itemsPerPage) }).map((_, index) => (
            <button
              key={index}
              className={`bg-blue-500 text-white p-2 rounded-md ml-1 ${currentPage === index + 1 ? 'bg-gray-700' : ''}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div>
          <button
            className="bg-blue-500 text-white p-2 rounded-md ml-1"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredUsers.length / itemsPerPage)}
          >
            Next Page
          </button>
          <button
            className="bg-blue-500 text-white p-2 rounded-md ml-1"
            onClick={() => handlePageChange(Math.ceil(filteredUsers.length / itemsPerPage))}
          >
            Last Page
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
