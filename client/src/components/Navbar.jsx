import { useState } from "react";
import Image from "./Image";
import { Link } from "react-router-dom";
import { useAuth, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { useEffect } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const { getToken } = useAuth();

  useEffect(() => {
    getToken().then((token) => { console.log(token) });
  }, [getToken]);

  return (
    <div className="flex items-center justify-between w-full h-16 md:h-20">
      {/*LOGO*/}
      <Link to="/" className="flex items-center gap-4 text-2xl font-bold">
        <Image src="logo.png" alt="logo" w={32} h={32} />
        <span>Blog</span>
      </Link>
      {/*Mobile Menu*/}
      <div className="md:hidden">
        {/*Mobile Button*/}
        <div className="relative z-50 -ml-8 text-4xl cursor-pointer" onClick={() => setOpen((prev) => !prev)}>
          {open ? <Image src="close.png" alt="twitterx" w={32} h={32} /> : 
          <Image src="icons8-menu-94.png" alt="menu" w={32} h={32} />}
        </div>
        {/*Mobile Link List*/}
        <div className={`w-full h-screen bg-[#e6e6ff] flex flex-col items-center justify-center gap-8 font-medium text-lg absolute top-16 transition-all ease-in-out z-50 ${open ? "-right-0" : "-left-[100%]"}`}>
          <Link to="/" onClick={() => setOpen(false)} className="px-4 py-2 transition bg-transparent rounded-3xl hover:bg-blue-800 hover:text-white">Home</Link>
          <Link to="/posts" onClick={() => setOpen(false)} className="px-4 py-2 transition bg-transparent rounded-3xl hover:bg-blue-800 hover:text-white">Search</Link>
          <Link to="/write" onClick={() => setOpen(false)} className="px-4 py-2 transition bg-transparent rounded-3xl hover:bg-blue-800 hover:text-white">Write</Link>
          <Link to="/savedpost" onClick={() => setOpen(false)} className="px-4 py-2 transition bg-transparent rounded-3xl hover:bg-blue-800 hover:text-white">Saved Posts</Link>
          <SignedOut>
            <Link to="/login" onClick={() => setOpen(false)}>
              <button className="px-4 py-2 text-white bg-blue-800 rounded-3xl">Login 🔐</button>
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
      {/*Desktop Menu*/}
      <div className="items-center hidden gap-8 font-medium md:flex xl:gap-12">
        <Link to="/">Home</Link>
        <Link to="/posts">Search</Link>
        <Link to="/write">Write</Link>
        <Link to="/savedpost">Saved Posts</Link>
        <SignedOut>
          <Link to="/login">
            <button className="px-4 py-2 text-white bg-blue-800 rounded-3xl">Login 🔐</button>
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

    </div>
  )
}

export default Navbar;