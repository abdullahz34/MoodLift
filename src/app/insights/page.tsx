"use client"
import React, { useEffect, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import axios from 'axios';
import './InsightsPage.css';

Chart.register(...registerables);

const InsightsPage = () => {
  // State hooks for your data
  const [appointments, setAppointments] = useState([]);
  const [logbookEntries, setLogbookEntries] = useState([]);
  const [surveys, setSurveys] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const appointmentsData = await axios.get('/api/getAppointments');
      setAppointments(appointmentsData.data);

      const logbookData = await axios.get('/api/getLogbooks');
      // recalculate calories
      const newData = [];
        logbookData.data.forEach(entry => {
            try {
                const calories = calculateEnergy(entry.nutrition.protein, entry.nutrition.carbs, entry.nutrition.fats);
                newData.push({
                ...entry,
                nutrition: {
                    ...entry.nutrition,
                    calories,
                },
                });
            } catch (error) {
                console.error('Error calculating calories', error);
            }

        });
      setLogbookEntries(newData);

      const surveysData = await axios.get('/api/surveys');
      setSurveys(surveysData.data.surveys);
      console.log(surveysData.data.surveys);
    };

    fetchData();
  }, []);

  const last7Days = logbookEntries.slice(-7);

  function calculateEnergy(proteins, carbs, fats) {
    return (proteins * 4) + (carbs * 4) + (fats * 9);
}

  const createGraphData = (label, key1, key2, colors) => {
    const data = {
      labels: last7Days.map(entry => new Date(entry.date).toLocaleDateString()),
      datasets: [
        {
          label: label,
          data: last7Days.map(entry => entry[key1][key2]),
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1,
        },
      ],
    };

    return data;
  };

  const sleepData = createGraphData('Sleep Hours', 'sleep', 'hoursSlept', 'rgba(255, 99, 132, 0.5)');
  const caloriesData = createGraphData('Calories', 'nutrition', 'calories', 'rgba(54, 162, 235, 0.5)');
  const waterIntakeData = createGraphData('Water Intake (ml)', 'hydration', 'waterML', 'rgba(255, 206, 86, 0.5)');
  const fitnessData = createGraphData('Fitness Activity', 'fitness', 'steps', 'rgba(75, 192, 192, 0.5)');

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };


  return (
    <div>
      <div className="grid-container">
        <div className="logbook-section">
            <h2>Upcoming Appointments</h2>
            <ul>
                {appointments.map((appointment, index) => (
                <li key={index}>
                    {appointment.AmbassadorID} with {appointment.EmployeeID} on {new Date(appointment.schedule).toLocaleString()}
                </li>
                ))}
            </ul>
        </div>
      </div>
      <div className="appointments-section">
        <div>
            <h2>Logbook Overview (Last 7 Days)</h2>
            <div className="graph-container"> {/* You might want to style this container */}
            <Bar data={sleepData} options={options} />
            <Bar data={caloriesData} options={options} />
            <Bar data={waterIntakeData} options={options} />
            <Bar data={fitnessData} options={options} />
            </div>
        </div>
      </div>
      <div className="surveys-section">
        <div>
            <h2>Available Surveys</h2>
            <ul>
                {surveys.map((survey, index) => (
                <li key={index}>{survey.title}</li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
