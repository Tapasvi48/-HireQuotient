// src/components/UserTable.js
import React, { useState, useEffect } from 'react';
import './UserTable.css';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const pageSize = 10;
  const [editedValues, setEditedValues] = useState({});
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
      const userData = await response.json();
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleBulkDelete = (selectedRows) => {

    console.log('Delete selected users:', selectedRows);
    

    setUsers(prevUsers => prevUsers.filter(user => !selectedRows.includes(user.id)));
    setSelectedRows([]); 
  };

  const renderTable = () => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const displayedUsers = users.slice(start, end);

    return (
      <table>
        {/* Table header with column titles */}
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                id="selectAll"
                className="checkbox"
                onChange={handleSelectAll}
              />
              <span style={{marginLeft:"20px"}}>
              Select All
              </span>
            </th>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        {/* Table body with rows */}
        <tbody>
          {displayedUsers.map(user => (
            <tr
              key={user.id}
              className={selectedRows.includes(user.id) ? 'selected' : ''}
            >
              <td>
                <input
                  type="checkbox"
                  className="checkbox"
                  onChange={() => handleSelect(user.id)}
                />
              </td>
              <td>{user.id}</td>
              <td>
                {editedValues.id === user.id ? (
                  <input
                    type="text"
                    value={editedValues.name}
                    onChange={(e) => setEditedValues({ ...editedValues, name: e.target.value })}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {editedValues.id === user.id ? (
                  <input
                    type="text"
                    value={editedValues.email}
                    onChange={(e) => setEditedValues({ ...editedValues, email: e.target.value })}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editedValues.id === user.id ? (
                  <input
                    type="text"
                    value={editedValues.role}
                    onChange={(e) => setEditedValues({ ...editedValues, role: e.target.value })}
                  />
                ) : (
                  user.role
                )}
              </td>
              <td>
                {editedValues.id === user.id ? (
                  <>
                    <button className="save" onClick={() => handleSave(user.id)}>
                      Save
                    </button>
                    <button className="cancel" onClick={() => setEditedValues({})}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button style={{marginRight:"20px"}} className="edit" onClick={() => handleEdit(user.id)}>
                    Edit
                  </button>
                )}
                <button className="delete" onClick={() => handleDelete(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const handleSelectAll = () => {
    const allUserIds = users.map(user => user.id);
    setSelectedRows(selectedRows.length === allUserIds.length ? [] : allUserIds);
  };

  const handleSelect = (userId) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(userId)) {
        return prevSelectedRows.filter(id => id !== userId);
      } else {
        return [...prevSelectedRows, userId];
      }
    });
  };

  const handleEdit = (userId) => {
    const userToEdit = users.find(user => user.id === userId);
    if (userToEdit) {
      setEditedValues({
        id: userId,
        name: userToEdit.name,
        email: userToEdit.email,
        role: userToEdit.role,
      });
    } else {
      console.warn('User not found for editing');
    }
    console.log(`Edit user with ID ${userId}`);
  };
  const handleSave = (userId) => {

    const userIndex = users.findIndex(user => user.id === userId);


    if (userIndex !== -1) {
      const updatedUsers = [...users];
      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],
        name: editedValues.name,
        email: editedValues.email,
        role: editedValues.role,
      };


      setUsers(updatedUsers);
      setEditedValues({});
    } else {
      console.warn('User not found for saving');
    }
  };
  const handleDelete = (userId) => {
    const updatedUsers = users.filter(user => user.id !== userId);


    setUsers(updatedUsers);


    setSelectedRows([]);
    console.log(`Delete user with ID ${userId}`);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(users.length / pageSize);

    return (
      <div className="pagination">
        <button
          className="pagination-btn first-page"
          onClick={() => setCurrentPage(1)}
        >
          First
        </button>
        <button
          className="pagination-btn previous-page"
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="pagination-btn next-page"
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
        <button
          className="pagination-btn last-page"
          onClick={() => setCurrentPage(totalPages)}
        >
          Last
        </button>
      </div>
    );
  };

  return (
    <div>
      <div>
        <input type="text" placeholder="Search" />
        <button className="search-icon">Search</button>
      </div>

      {renderTable()}

      {renderPagination()}

      <button
        className="bulk-delete-btn"
        onClick={() => handleBulkDelete(selectedRows)}
        style={{marginBottom:"20px"}}
      >
        Delete Selected
      </button>
    </div>
  );
};

export default UserTable;
