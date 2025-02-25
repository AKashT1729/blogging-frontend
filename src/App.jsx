
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CreatePost from './pages/CreatePost'
import SinglePost from './pages/SinglePost'

function App() {


  return (
    <>
     <Router>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/create' element={<CreatePost/>}/>
        <Route path='/post/:id' element={<SinglePost/>}/>
      </Routes>
     </Router>
    </>
  )
}

export default App
