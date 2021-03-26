import React from 'react';

// importing 'react-google-login' library
import { GoogleLogout } from 'react-google-login';

// client id in mock application @ google cloud
const clientId =
  '323655611199-0b2di2h8vfcgprr1k2jkrque3bu8chjd.apps.googleusercontent.com';

// reusable Logout component
function Logout() {
  const onSuccess = () => {
    console.log('Logout made successfully');
    alert('Logout made successfully ✌');
  };

  return (
    <div>
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      ></GoogleLogout>
    </div>
  );
}

export default Logout;