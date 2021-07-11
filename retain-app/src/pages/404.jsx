import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex h-screen">
      <div className="m-auto bg-white rounded-xl p-12">
        <h1 className="font-work text-6xl p-8">404 | Page Not Found</h1>
        <div className="flex justify-center">
          <Link to="/">
            <button className="bg-green-700 text-white rounded-lg p-2 font-work hover:bg-opacity-50">
              Return Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}