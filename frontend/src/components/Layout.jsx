import Footer from "./Footer"
import Navbar from "./Navbar"

const Layout = ({children}) => {
  return (
    <div className="flex min-h-svh flex-col bg-base-200 text-base-content">
        
        <Navbar />

        <main className="flex-1 w-full mx-auto max-w-7xl py-8 px-4 md:px-6 md:py-10">
            {children}
        </main>

        <Footer />

    </div>
  )
}

export default Layout