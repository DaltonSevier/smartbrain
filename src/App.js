import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Rank from './Components/Rank/Rank';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';
import ParticlesBg from 'particles-bg';
import './App.css';
import {
  useState
} from 'react';

function App() {

  const [imageURL, setImageURL] = useState('https://samples.clarifai.com/metro-north.jpg')
  const [box, setBox] = useState({});
  const [route, setRoute] = useState('signin');
  const [isSignedIn, setIsSignedIn] = useState(false);

  const calculateFaceLocation = (data) => {
    const bounding_box = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputImage')
    const width = Number(image.width);
    const height = Number(image.height);
    setBox({
      leftCol: bounding_box.left_col * width,
      topRow: bounding_box.top_row * height,
      rightCol: width - (bounding_box.right_col * width),
      bottomRow: height - (bounding_box.bottom_row * height)
    })
  }

  const onInputChange = (event) => {
    setImageURL(() => event.target.value)
  }

  const setupClarifai = (imageURL) => {
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // In this section, we set the user authentication, user and app ID, model details, and the URL
    // of the image we want as an input. Change these strings to run your own example.
    //////////////////////////////////////////////////////////////////////////////////////////////////

    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = 'ENTER_PAT_KEY';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'ENTER_USER_ID';
    const APP_ID = 'ENTER_APP_ID';
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
    const IMAGE_URL = imageURL;

    ///////////////////////////////////////////////////////////////////////////////////
    // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
    ///////////////////////////////////////////////////////////////////////////////////

    const raw = JSON.stringify({
      "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
      },
      "inputs": [{
        "data": {
          "image": {
            "url": IMAGE_URL
          }
        }
      }]
    });

    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
      },
      body: raw
    };

    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id

    // fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
    //     .then(response => response.json())
    //     .then(result => console.log(result.outputs[0].data.regions[0].region_info.bounding_box))
    //     .catch(error => console.log('error', error));
    // }

    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
      .then(response => response.json())
      .then(result => calculateFaceLocation(result))
      .catch(error => console.log('error', error));
  }



  const onButtonSubmit = () => {
    setupClarifai(imageURL)
  }

  const onRouteChange = (route) => {
    if(route === 'signout'){
      setIsSignedIn(false)
    }else if(route === 'home'){
      setIsSignedIn(true)
    }
    setRoute(() => route);
  }

  return (
    <div className="App">
        <ParticlesBg type="cobweb" bg={true} color='#FFFFFF' />
        <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange}/>
        { route === 'home' ? 
          <div>
          <Logo />
          <Rank />
          <ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit}/>
          <FaceRecognition box={box} imageURL={imageURL}/>
        </div>
          : (
            route === 'signin' 
            ? <Signin onRouteChange={onRouteChange}/>
            : <Register onRouteChange={onRouteChange}/>
            ) 
        }
    </div>
  );
}

export default App;
