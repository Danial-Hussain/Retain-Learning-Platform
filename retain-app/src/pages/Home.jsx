import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Form from "../components/form";

export default function Home() {
  const [topics, setTopics] = useState([]);
  const [mediums, setMediums] = useState([]);
  const [sources, setSources] = useState([]);

  useEffect(() => {
    fetch("/topics")
      .then((response) => response.json())
      .then((data) => {
        setTopics(data.map((val, ind) => val[0]));
      });
  }, []);

  useEffect(() => {
    fetch("/mediums")
      .then((response) => response.json())
      .then((data) => {
        setMediums(data.map((val, ind) => val[0]));
      });
  }, []);

  useEffect(() => {
    fetch("/sources")
      .then((response) => response.json())
      .then((data) => {
        setSources(data.map((val, ind) => val[0]));
      });
  }, []);

  return (
    <React.Fragment>
      <Navbar />
      <div className="mx-auto px-2 max-w-7xl">
        <Form topics={topics} mediums={mediums} sources={sources}/>
      </div>
    </React.Fragment>
  );
}