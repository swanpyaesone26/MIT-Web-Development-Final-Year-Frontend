import Footer from '@/components/core/Footer'
import Header from '@/components/core/Header'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div>
        <Header/>
        <Outlet/>
        <Footer/>
    </div>
  )
}

export default MainLayout