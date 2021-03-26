import React from 'react';

// importing 'react-google-login' library
import { GoogleLogin } from 'react-google-login';

// client id in mock application @ google cloud
const clientId =
  '323655611199-0b2di2h8vfcgprr1k2jkrque3bu8chjd.apps.googleusercontent.com';

// reusable Login component
function Login(props) {
  const onSuccess = (res) => {
    // console.log('Login Success: currentUser:', res.profileObj);
    alert(
      `Logged in successfully welcome ${res.profileObj.name} 😍. \n See console for full profile object.`
    );
    const value = res.profileObj;
    props.userData(value);
  };

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
    alert(
      `Failed to login. 😢 Please ping the students`
    );
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        style={{ marginTop: '100px' }}
        isSignedIn={true}
      />
    </div>
  );
}

export default Login;