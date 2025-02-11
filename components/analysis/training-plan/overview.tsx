"use client"

import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
)

const progressData = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [
    {
      label: "Rating Progress",
      data: [1800, 1825, 1840, 1850],
      borderColor: "rgb(59, 130, 246)",
      backgroundColor: "rgba(59, 130, 246, 0.5)",
      tension: 0.4,
    },
    {
      label: "Accuracy",
      data: [75, 78, 82, 85],
      borderColor: "rgb(234, 179, 8)",
      backgroundColor: "rgba(234, 179, 8, 0.5)",
      tension: 0.4,
    },
  ],
}

const trainingData = {
  labels: ["Tactics", "Openings", "Endgame", "Strategy", "Analysis"],
  datasets: [
    {
      label: "Hours Spent",
      data: [8, 6, 4, 5, 3],
      backgroundColor: [
        "rgba(59, 130, 246, 0.5)",
        "rgba(234, 179, 8, 0.5)",
        "rgba(34, 197, 94, 0.5)",
        "rgba(239, 68, 68, 0.5)",
        "rgba(168, 85, 247, 0.5)",
      ],
      borderColor: [
        "rgb(59, 130, 246)",
        "rgb(234, 179, 8)",
        "rgb(34, 197, 94)",
        "rgb(239, 68, 68)",
        "rgb(168, 85, 247)",
      ],
      borderWidth: 1,
    },
  ],
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Monthly Progress",
    },
  },
  scales: {
    y: {
      beginAtZero: false,
    },
  },
}

const barOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Training Distribution",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

export function Overview() {
  return (
    <div className="space-y-8">
      <div className="w-full">
        <h3 className="text-lg font-medium">Progress Overview</h3>
        <p className="text-sm text-muted-foreground">
          Your chess improvement journey this month
        </p>
        <div className="mt-4 h-[300px] w-full">
          <Line 
            data={progressData} 
            options={{
              ...options,
              maintainAspectRatio: false,
              responsive: true,
            }} 
          />
        </div>
      </div>
      <div className="w-full">
        <h3 className="text-lg font-medium">Training Distribution</h3>
        <p className="text-sm text-muted-foreground">
          Hours spent on different aspects
        </p>
        <div className="mt-4 h-[300px] w-full">
          <Bar 
            data={trainingData} 
            options={{
              ...barOptions,
              maintainAspectRatio: false,
              responsive: true,
            }} 
          />
        </div>
      </div>
    </div>
  )
} 