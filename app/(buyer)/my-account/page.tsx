"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const MyAccount = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  // Simulate authentication check
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!loggedInUser) {
      router.push("/buyer/signin"); // Redirect if not logged in
    } else {
      setUser(loggedInUser);
      fetchOrders();
    }
  }, []);

  // Fetch orders (simulate API call)
  const fetchOrders = async () => {
    const mockOrders = [
      {
        id: 1,
        name: "Cotton Fit and Flare Dress",
        price: 2999,
        originalPrice: 4999,
        discount: "40% Off",
        rating: 4.2,
        reviews: 68,
        imageUrl: "/placeholder.png", // Replace with actual images
      },
      {
        id: 2,
        name: "Cotton Fit and Flare Dress",
        price: 2999,
        originalPrice: 4999,
        discount: "40% Off",
        rating: 4.2,
        reviews: 68,
        imageUrl: "/placeholder.png",
      },
    ];
    setOrders(mockOrders);
  };

  return (
    <div className="flex p-6">
      {/* Left Sidebar */}
      <div className="w-1/4 p-4 border-r">
        <h2 className="text-2xl font-bold mb-6">Your Account</h2>
        <nav className="space-y-4">
          {["Profile", "Account", "Order", "Address"].map((item) => (
            <Link
              href={`/account/${item.toLowerCase()}`}
              key={item}
              className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-100"
            >
              {item} <span>›</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Right Content */}
      <div className="w-3/4 p-4">
        <h2 className="text-2xl font-bold mb-4">Past Orders</h2>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 mb-4 bg-gray-100 rounded-lg">
              <div className="flex items-center">
                <Image src={order.imageUrl} alt={order.name} width={80} height={80} className="rounded-lg" />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">{order.name}</h3>
                  <p className="text-gray-600">
                    <span className="font-bold">MRP: ₹{order.price}</span>{" "}
                    <span className="line-through text-gray-500">₹{order.originalPrice}</span> {order.discount}
                  </p>
                  <p className="text-yellow-500">⭐ {order.rating} ({order.reviews})</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-200">Track your Order</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Add to Bag
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No past orders found.</p>
        )}
      </div>
    </div>
  );
};

export default MyAccount;
