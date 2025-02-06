import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { FaSearch, FaUser, FaCaretDown, FaShoppingCart } from "react-icons/fa";
import Flex from "../../designLayouts/Flex";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { paginationItems } from "../../../constants";

const HeaderBottom = () => {
  const products = useSelector((state) => state.orebiReducer.products);
  const [showCategories, setShowCategories] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();
  const categoryRef = useRef();
  const userMenuRef = useRef();

  // Handle click outside for category menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setShowCategories(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle click outside for user menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  useEffect(() => {
    const filtered = paginationItems.filter((item) =>
      item.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery]);

  const handleProductNavigation = (item) => {
    navigate(
      `/product/${item.productName.toLowerCase().split(" ").join("")}`,
      { state: { item } }
    );
    setSearchQuery("");
  };

  return (
    <div className="w-full bg-[#F5F5F3] relative">
      <div className="max-w-container mx-auto">
        <Flex className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full px-4 pb-4 lg:pb-0 h-full lg:h-24">
          {/* Category Menu */}
          <div
            ref={categoryRef}
            role="button"
            aria-expanded={showCategories}
            className="flex h-14 cursor-pointer items-center gap-2 text-primeColor relative"
            onClick={() => setShowCategories(!showCategories)}
          >
            <HiOutlineMenuAlt4 className="w-5 h-5" />
            <p className="text-[14px] font-normal">Shop by Category</p>

            {showCategories && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute top-14 z-50 bg-primeColor w-auto text-[#767676] p-4 shadow-lg"
              >
                {['Accessories', 'Furniture', 'Electronics', 'Clothes', 'Bags', 'Home appliances']
                  .map((category) => (
                    <li
                      key={category}
                      className="text-gray-400 px-4 py-2 border-b border-gray-400 hover:border-white hover:text-white transition-colors cursor-pointer"
                    >
                      {category}
                    </li>
                  ))}
              </motion.ul>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-[600px] h-[50px] text-base text-primeColor bg-white flex items-center gap-2 justify-between px-6 rounded-xl">
            <input
              className="flex-1 h-full outline-none placeholder:text-[#C4C4C4] placeholder:text-[14px]"
              type="text"
              onChange={handleSearch}
              value={searchQuery}
              placeholder="Search your products here"
              aria-label="Product search"
            />
            <FaSearch className="w-5 h-5" />

            {searchQuery && (
              <div className="absolute top-16 left-0 w-full bg-white z-50 max-h-96 overflow-y-auto shadow-xl">
                {filteredProducts.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleProductNavigation(item)}
                    className="p-3 hover:bg-gray-100 transition-colors cursor-pointer flex items-center gap-4"
                  >
                    <img 
                      className="w-16 h-16 object-contain" 
                      src={item.img} 
                      alt={item.productName}
                    />
                    <div>
                      <p className="font-semibold text-lg">{item.productName}</p>
                      <p className="text-sm text-gray-600">${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Menu & Cart */}
          <div className="flex gap-4 mt-2 lg:mt-0 items-center pr-6 relative">
            <div 
              ref={userMenuRef}
              className="flex items-center gap-1 cursor-pointer relative"
              onClick={() => setShowUserMenu(!showUserMenu)}
              role="button"
              aria-expanded={showUserMenu}
            >
              <FaUser />
              <FaCaretDown className="mt-1" />
              
              {showUserMenu && (
                <motion.ul
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-8 right-0 bg-white shadow-lg w-48 z-50"
                >
                  <Link to="/signin" className="block hover:bg-gray-100">
                    <li className="px-4 py-3 text-gray-700">Login</li>
                  </Link>
                  <Link 
                    to="/signup" 
                    onClick={() => setShowUserMenu(false)}
                    className="block hover:bg-gray-100"
                  >
                    <li className="px-4 py-3 text-gray-700">Sign Up</li>
                  </Link>
                  <li className="px-4 py-3 text-gray-700 hover:bg-gray-100">
                    Profile
                  </li>
                  <li className="px-4 py-3 text-gray-700 hover:bg-gray-100 border-t">
                    Others
                  </li>
                </motion.ul>
              )}
            </div>

            <Link 
              to="/cart" 
              className="relative"
              aria-label="Shopping cart"
            >
              <FaShoppingCart className="w-6 h-6" />
              {products.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primeColor text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {products.length}
                </span>
              )}
            </Link>
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default HeaderBottom;