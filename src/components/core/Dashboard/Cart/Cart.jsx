import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import RenderCartCourses from "./RenderCartCourses";
import RenderTotalAmount from "./RenderTotalAmount";
import { useMediaQuery } from "react-responsive";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import Sidebar from "../Sidebar";
import { getEntireCart } from "../../../../services/operations/cartAPI";
import { setTotalItems } from "../../../../slices/cartSlice";

const Cart = () => {
  // Media query to check if screen size is greater than 768px
  const isMediumScreenOrLarger = useMediaQuery({ minWidth: 768 });

  const [sidebarIconClicked, setSidebarIconClicked] = useState(false);

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartUpdated, setCartUpdated] = useState(false);

  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const getEntireCartData = async () => {
      setLoading(true);
      try {
        const cartData = await getEntireCart(token);
        // console.log("cartData", cartData);
        setCart(cartData);
        dispatch(setTotalItems(cartData?.data?.data?.totalItems));
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    getEntireCartData();
    // eslint-disable-next-line
  }, [cartUpdated]);

  return (
    <div>
      {/* Responsive design for small screen */}
      <div className="mb-4 md:hidden">
        {!isMediumScreenOrLarger &&
          (sidebarIconClicked ? (
            <div className="flex">
              <GoSidebarExpand
                size={24}
                fill="#AFB2BF"
                onClick={() => setSidebarIconClicked(!sidebarIconClicked)}
              />
              <Sidebar />
            </div>
          ) : (
            <GoSidebarCollapse
              size={24}
              fill="#AFB2BF"
              onClick={() => setSidebarIconClicked(!sidebarIconClicked)}
            />
          ))}
      </div>

      <h2 className="mb-14 text-3xl font-medium text-richblack-5">Cart</h2>
      <p className="text-richblack-400 font-semibold">
        {cart?.data?.data?.totalItems} Courses in Cart
      </p>
      <div className="w-full h-[1px] bg-richblack-400 mt-2"></div>
      {cart?.data?.data?.totalPrice > 0 ? (
        <div className="flex flex-col lg:flex-row mt-8 items-center lg:items-start gap-x-10 gap-y-6 ">
          <RenderCartCourses
            loading={loading}
            cart={cart?.data?.data?.userDetails?.cartItems}
            setCartUpdated={setCartUpdated}
          />
          <RenderTotalAmount
            total={cart?.data?.data?.totalPrice}
            cart={cart?.data?.data?.userDetails?.cartItems}
            setCartUpdated={setCartUpdated}
          />
        </div>
      ) : (
        <div className="text-center text-richblack-5 mt-4 text-3xl">
          Your cart is empty
        </div>
      )}
    </div>
  );
};

export default Cart;
