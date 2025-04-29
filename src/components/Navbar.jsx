import Logo from "./Logo";

export default function Navbar() {
  return (
    <header className="w-full p-4 shadow-lg bg-gray-200 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Logo />
        {/* You can add links or buttons on the right if needed */}
      </div>
    </header>
  );
}
