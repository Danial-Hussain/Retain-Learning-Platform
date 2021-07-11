import React, { useEffect, useState, Fragment } from "react";
import Navbar from "../components/navbar";
import Table from "../components/table";

export default function Dashboard() {
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    fetch("/episodes")
      .then((response) => response.json())
      .then((data) => {
        setEpisodes(data);
      });
  }, []);

  return (
    <Fragment>
      <Navbar />
      <div className="flex justify-center p-4">
        <h1 className="font-work font-bold text-4xl">Podcast Table</h1>
      </div>
      <div className="grid grid-cols-9">
        <div className="col-span-5 col-start-3">
          <Table rows={episodes} />
        </div>
      </div>
    </Fragment>
  );
}