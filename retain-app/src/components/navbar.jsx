import React from "react";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import {
  AcademicCapIcon,
  InformationCircleIcon,
  PencilIcon,
} from "@heroicons/react/solid";

export default function Navbar() {
  return (
    <Fragment>
      <div className="width-full flex justify-center bg-green-800 bg-opacity-75 p-2 pb-3">
        <h1 className="font-work text-xl text-white">
          Retain: Iterative Learning Platform
        </h1>
        <div className="pl-1 pt-1">
          <AcademicCapIcon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="width-full flex justify-center bg-green-300 p-2">
        <Link to="/">
          <button className="bg-green-900 text-white rounded-lg p-2 mr-2 font-work font-bold hover:bg-opacity-50">
            <InformationCircleIcon className="inline-block h-6 w-6 mr-1 mb-1 text-white" />
            Enter Information
          </button>
        </Link>
        <Link to="/recommendations">
          <button className="bg-white text-green-900 rounded-lg p-2 ml-2 font-work font-bold hover:bg-gray-100">
            <PencilIcon className="inline-block h-6 w-6 mr-1 mb-1 text-green-900" />
            Learning Resources
          </button>
        </Link>
      </div>
    </Fragment>
  );
}