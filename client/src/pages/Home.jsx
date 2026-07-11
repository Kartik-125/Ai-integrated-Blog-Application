import React, {useState} from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import BlogList from '../components/BlogList'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'

const Home = () => {

  const [search, setSearch] = useState('')

  return (
    <div>
      <Navbar/>

      <Header
        search = {search}
        setSearch = {setSearch}
      />

      <BlogList search = {search} />

      <Newsletter/>
      
      <Footer/>
    </div>
  )
}

export default Home
