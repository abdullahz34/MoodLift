"use client"
import React, { useEffect, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import './InsightsPage.css';

Chart.register(...registerables);

const InsightsPage = () => {
  const [logbookEntries, setLogbookEntries] = useState([]);
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const logbookData = await axios.get('/api/getLogbooks');
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
    };

    fetchData();
  }, []);

  const last7Days = logbookEntries.slice(-7);

  function calculateEnergy(proteins, carbs, fats) {
    return (proteins * 4) + (carbs * 4) + (fats * 9);
  }

  const createGraphData = () => {
    const data = {
      labels: last7Days.map(entry => new Date(entry.date).toLocaleDateString()),
      datasets: [
        {
          label: 'Sleep Hours',
          data: last7Days.map(entry => entry.sleep ? entry.sleep.hoursSlept : null),
          borderColor: 'rgba(255, 99, 132, 0.5)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
        },
        {
          label: 'Calories',
          data: last7Days.map(entry => entry.nutrition ? entry.nutrition.calories : null),
          borderColor: 'rgba(54, 162, 235, 0.5)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
        },
        {
          label: 'Water Intake (ml)',
          data: last7Days.map(entry => entry.hydration ? entry.hydration.waterML : null),
          borderColor: 'rgba(255, 206, 86, 0.5)',
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
        },
        {
          label: 'Fitness Activity',
          data: last7Days.map(entry => entry.fitness ? entry.fitness.steps : null),
          borderColor: 'rgba(75, 192, 192, 0.5)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        },
      ],
    };

    return data;
  };

  const graphData = createGraphData();

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        reverse: true, // Add this line to reverse the x-axis labels
      },
    },
  };

  return (
    <div className='max-w-[1400px] mx-auto w-full px-3 py-10'>
      <h2 className='text-black text-center mt-12 mb-5 text-2xl font-semibold'>Your Insights</h2>
      <div className="appointments-section">
        <div>
          <h2 className='mb-3 text-black'>Logbook Overview (Last 7 Days)</h2>
          <div className="graph-container">
            <Line data={graphData} options={options} />
          </div>
        </div>
      </div>
      <div className="surveys-section">
        <div>
          <h2 className='text-black my-5 text-lg font-bold'>Available Surveys</h2>
          <ul className='list-disc ml-6'>
            {surveys.map((survey, index) => (
              <li key={index} className='text-black mb-2'>{survey.title}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;