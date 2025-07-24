// import './App.css';
// import { ImageUpload } from './home';

// function App() {
//   return <ImageUpload />;
// }

// export default App;
// import './App.css';
// import { ImageUpload } from './home';

// function App() {
//   return (
//     <div
//       style={{
//         backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${process.env.PUBLIC_URL + '/potato.png'})`,

        
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundRepeat: 'no-repeat',
//         minHeight: '100vh',
//         width: '100%',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//       }}
//     >
//       <ImageUpload />
//     </div>
//   );
// }

// export default App;

import './App.css';
import { ImageUpload } from './home';

function App() {
  return (
    
    <div style={{
      
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${process.env.PUBLIC_URL + '/potato2.png'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: 0,
      }} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <ImageUpload />
      </div>
    </div>
  );
}
export default App;
