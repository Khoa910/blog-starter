import Search from "./Search"

const SideMenu = () => {
    return (
        <div className="sticky px-4 h-max top-8">
            <h1 className="mb-4 text-sm font-medium">Search</h1>
            <Search/>
            <h1 className="mt-8 mb-4 text-sm font-medium">Filter</h1>
            <h1 className="mt-8 mb-4 text-sm font-medium">Catergories</h1>
        </div>
    )
}

export default SideMenu;