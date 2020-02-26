import axios from 'axios';

export function getRoleWiseAccess() {

  return dispatch =>{

  const roles = localStorage.getItem('roles');
  
      return axios.post("/api/accessmaster/getRolewiseAccess",roles)
        .then((response)=>{
            dispatch(fetchRolewiseAccess(response.data));
        })
        .catch((error)=>{
              console.log('error', error);
        })
    
  }  
}

export const fetchRolewiseAccess = rolewiseAccess => ({
  type: 'FETCH_ROLEWISE_ACCESS',
  rolewiseAccess: rolewiseAccess
});


