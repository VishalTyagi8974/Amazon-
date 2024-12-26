// import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Navbar from '@components/header/Navbar';
import Footer from '@components/footer/Footer';
import { Outlet } from 'react-router-dom';

function App() {

  return (
    <div className='d-flex flex-column justify-content-between' style={{ minHeight: "100vh" }}>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default App
