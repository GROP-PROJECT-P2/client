import { useNavigate } from "react-router";
import MobileNav from "./MobileNav";

function Navbar() {
  const navigate = useNavigate();
  return (
    <header>
      <div className="py-4 xl:py-4 bg-blue-500">
        <div className="container mx-auto flex justify-between items-center">
          {/* logo */}
          <a href="/">
            <h1 className="text-4xl font-semibold text-white">Chatsum</h1>
          </a>

          <div className="hidden xl:flex item-center gap-8">
            <nav className="flex gap-8 text-white">
              <a
                onClick={() => {
                  navigate("/login");
                }}
                className={`text-accent border-accent capitalize font-medium hover:text-accent transition-all cursor-pointer`}
              >
                Login
              </a>

              <a
                onClick={() => {
                  navigate("/about");
                }}
                className={`text-accent border-accent capitalize font-medium hover:text-accent transition-all cursor-pointer`}
              >
                Tentang Kami
              </a>
            </nav>
          </div>
          <div className="xl:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
