import React, { useState, useEffect } from "react";
import { Slider, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

export default function Form(props) {
  const { topics, mediums, sources } = props;
  const [topicChoice, setTopicChoice] = useState("");
  const [mediumChoice, setMediumChoice] = useState("");
  const [sourceChoice, setSourceChoice] = useState("");
  const [factChoice, setFactChoice] = useState("");
  const [confidenceChoice, setConfidenceChoice] = useState([5]);

  return (
    <div className="mt-8 mb-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
        <div className="mb-0 space-y-6">
          <h1 className="text-center text-4xl font-work font-bold">
            Text Form
          </h1>
          <h1 className="block text-lg font-work font-medium">Topic</h1>
          <Autocomplete
            id="topic"
            freeSolo
            options={topics}
            onInputChange={(e, val) => setTopicChoice(val)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Enter a topic | ex: Machine Learning"
                margin="small"
                variant="outlined"
                value={topicChoice}
              />
            )}
          />
          <h1 className="block text-lg font-work font-medium">
            Information- Medium
          </h1>
          <Autocomplete
            id="medium"
            freeSolo
            options={mediums}
            onInputChange={(e, val) => setMediumChoice(val)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Enter a category | ex: Book, Article, Video"
                margin="small"
                variant="outlined"
                value={mediumChoice}
              />
            )}
          />
          <h1 className="block text-lg font-work font-medium">
            Information- Source
          </h1>
          <Autocomplete
            id="source"
            freeSolo
            options={sources}
            onInputChange={(e, val) => setSourceChoice(val)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Enter the source | ex: StatQuest"
                margin="small"
                variant="outlined"
                value={sourceChoice}
              />
            )}
          />
          <h1 className="block text-lg font-work font-medium">
            Information- Fact
          </h1>
          <textarea
            id="fact"
            value={factChoice}
            onChange={(e) => setFactChoice(e.target.value)}
            autoComplete="off"
            placeholder="Enter a fact"
            className="font-work text-sm w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-800 focus:border-opacity-75 focus:ring focus:ring-green-800"
          ></textarea>
          <h1 className="block text-lg font-work font-medium">
            Confidence Level
            <h1 className="block text-gray-500 text-xs font-work font-medium">
              Likelihood of remembering [1-10]
            </h1>
          </h1>
          <Slider
            id="confidence"
            value={confidenceChoice}
            onChange={(e, val) => setConfidenceChoice(val)}
            defaultValue={5}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={10}
          />
          <hr />
          <div className="flex justify-center">
            <button
              className="border border-gray-300 text-green-900 rounded-lg p-2 font-work font-bold hover:bg-gray-200"
              onClick={async () => {
                const form = {
                  topicChoice,
                  mediumChoice,
                  sourceChoice,
                  factChoice,
                  confidenceChoice,
                };
                const response = await fetch("/submit", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(form),
                });
                setFactChoice("");
                setConfidenceChoice([5]);
              }}
            >
              Submit Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}