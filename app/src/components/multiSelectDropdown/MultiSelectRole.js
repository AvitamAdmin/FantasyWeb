import React, { useEffect, useState } from 'react';
import { api } from '@/envfile/api';
import { Autocomplete, TextField } from '@mui/material';
import axios from 'axios';

function MultiSelectRole({ selectedRoles, setSelectedRoles }) {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    getAllRoles();
  }, []);

  const getAllRoles = async () => {
    try {
      const response = await axios.get(api + '/admin/role/get');
      setRoles(response.data.roles);
      console.log(response.data.roles, 'roles fetched');
    } catch (error) {
      console.log(error, 'error fetching roles');
    }
  };

  // Handle role change and map to recordId
  const handleRoleChange = (event, newValue) => {
    const selectedRoleIds = newValue.map((role) => ({
      recordId: role.recordId, // Ensure that recordId is mapped correctly
    }));
    
    setSelectedRoles(selectedRoleIds); // Update the parent state
    console.log('Selected roles:', selectedRoleIds); // Log selected role IDs
  };

  return (
    <div className='w-full'>
      <Autocomplete
        multiple
        options={roles}
        getOptionLabel={(option) => option.identifier || ''} // Use identifier for display
        value={selectedRoles.map(role => roles.find(r => r.recordId === role.recordId) || null)} // Map the value
        onChange={handleRoleChange}
        className='w-full'
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Roles"
            variant="standard"
            className='w-full'
          />
        )}
      />
    </div>
  );
}

export default MultiSelectRole;