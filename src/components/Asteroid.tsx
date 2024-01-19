import React, { useState, useEffect } from "react";
import { DayPicker, SelectSingleEventHandler } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import './Asteroid.css';
import _ from 'lodash';

export const Asteroid = () => {
    const [asteroidsInfo, setAsteroidsInfo] = useState(null);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [displayedStartDate, setDisplayedStartDate] = useState(new Date());
    const apiKey = "DEMO_KEY";


    useEffect(() => {
        const handleFetchData = async () => {
            try {
                let start_date = startDate.toJSON().slice(0, 10).replace(/-/g, "-");
                const response = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${start_date}&api_key=${apiKey}`);
                const data = await response.json();
        
                if (data && data.near_earth_objects && data.near_earth_objects[start_date]) {
                    setAsteroidsInfo(data.near_earth_objects[start_date]);
                } else {
                    console.error("Unexpected data structure in API response");
                }
            } catch (error) {
                console.error("Error fetching or parsing data:", error);
            }
        }
        const delay = 1000;
        setTimeout(() => {
            handleFetchData();
        }, delay);
      }, [startDate]);

    return (
        <>
            <div id="calendar">
            <DayPicker
                mode="single"
                selected={displayedStartDate}
                onSelect={(day: Date | undefined) => {
                    if (day) {
                        const newStartDate = new Date(day.getTime() + 24 * 60 * 60 * 1000);
                        setStartDate(newStartDate);
                        setDisplayedStartDate(day);
                    }
                }}
            />
            </div>
                {asteroidsInfo !== null ? (
                    (asteroidsInfo as any[]).map((asteroid) => (
                        <div id="info-box" key={asteroid.id}>
                            <div className="name-div" key={asteroid.id}>
                                <a href={asteroid?.nasa_jpl_url} className="name-link">
                                    Asteroid{" "}
                                    <div className="asteroid-name">{asteroid?.name}</div>
                                </a>
                            </div>
                            <p>
                                <div className="info-text">
                                    min diameter {asteroid.estimated_diameter.meters.estimated_diameter_min}
                                </div>
                            </p>
                            <p>
                                <div className="info-text">
                                <p>max diameter {asteroid.estimated_diameter.meters.estimated_diameter_max}</p>
                                </div>
                            </p>
                            <p>
                                <div className="info-text">
                                <p>hazardous? {asteroid.is_potentially_hazardous_asteroid ? "Yes" : "No"}</p>
                                </div>
                            </p>
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
                        </div>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
        </>
    );
}