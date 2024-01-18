import React, { useState, useEffect } from "react";
import { DayPicker } from 'react-day-picker';

export const Asteroid = () => {
    const [asteroidsInfo, setAsteroidsInfo] = useState(null);
    const [startDate, setStartDate] = useState<Date>();
    let footer = <p>Pick a day.</p>;
    let start_date = new Date().toJSON().slice(0, 10).replace(/-/g, "-");
    const apiKey = "DEMO_KEY";
    useEffect(() => {
        fetch(
          `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start_date}&api_key=${apiKey}`
        )
          .then((res) => res.json())
          .then((result) => {
            setAsteroidsInfo(result.near_earth_objects[start_date]);
          });
      }, []);



    return (
        <>
            <DayPicker
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                footer={footer}
            />
            {asteroidsInfo !== null ? (
                (asteroidsInfo as any[]).map((asteroid) => (
                    <>
                        <div className="name-div" key={asteroid.id}>
                            <a href={asteroid?.nasa_jpl_url} className="name-link">
                                Asteroid{" "}
                                <div className="asteroid-name">{asteroid?.name}</div>
                            </a>
                        </div>
                        <div className="diameter-div">
                            <p>min diameter {asteroid.estimated_diameter.meters.estimated_diameter_min}</p>
                        </div>
                        <div className="diameter-div">
                            <p>max diameter {asteroid.estimated_diameter.meters.estimated_diameter_max}</p>
                        </div>
                        <div className="hazardous-div">
                            <p>hazardous? {asteroid.is_potentially_hazardous_asteroid ? "Yes" : "No"}</p>
                        </div>
                        <div className="approach-div">
                            {asteroid.close_approach_data.map((approach:any) => (
                            <div key={approach.epoch_date_close_approach}>
                                <p>close_approach_date {approach.close_approach_date_full}</p>
                                <p>relative_velocity {approach.relative_velocity.kilometers_per_hour} km/h</p>
                                <p>miss_distance {approach.miss_distance.kilometers} km</p>
                                <p>orbiting_body {approach.orbiting_body}</p>
                            </div>
                            ))}
                            <p>potential impact in the future? {asteroid.is_sentry_object ? "Yes" : "No"}</p>
                        </div>
                    </>
                ))
            ) : null}
        </>
    );
}