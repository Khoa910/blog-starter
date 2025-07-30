import { useState } from "react";
import ImageKit from "./Image";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full h-16 md:h-20 flex items-center justify-between">
      {/*LOGO*/}
      <div className="flex items-center gap-4 text-2xl font-bold">
        <ImageKit src="logo.png" alt="logo" w={32} h={32} />
        <span>Blog</span>
      </div>
      {/*Mobile Menu*/}
      <div className="md:hidden">
        {/*Mobile Button*/}
        <div className="cursor-pointer text-4xl" onClick={() => setOpen((prev) => !prev)}>
          {open ? <img width="32" height="32" src="https://img.icons8.com/stamp/32/twitterx.png" alt="twitterx"/> : 
          <img width="32" height="32" src="https://img.icons8.com/3d-fluency/94/menu.png" alt="menu"/>}
        </div>
        {/*Mobile Link List*/}
        <div className={`w-full h-screen flex flex-col items-center justify-center gap-8 font-medium text-lg absolute top-16 transition-all ease-in out ${open ? "-right-0" : "-left-[100%]"}`}>
          <a href="/">Home</a>
          <a href="/">Trending</a>
          <a href="/">Most Popular</a>
          <a href="/">About</a>
          <a href="">
            <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">Login 🔐</button>
          </a>
        </div>
      </div>
      {/*Desktop Menu*/}
      <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium">
        <a href="/">Home</a>
        <a href="/">Trending</a>
        <a href="/">Most Popular</a>
        <a href="/">About</a>
        <a href="">
          <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">Login 🔐</button>
        </a>
      </div>

    </div>
  )
}

export default Navbar;