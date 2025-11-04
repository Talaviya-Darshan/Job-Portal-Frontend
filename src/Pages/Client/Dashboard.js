import React, { useEffect, useState } from "react";
import UserLayout from "../../components/UserLayout";
import { Link } from "react-router-dom";
import ContentHeader from "../../components/ContentHeader";
import CountUp from "react-countup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [count, setCount] = useState({
    Jobs: 0,
    Candidates: 0,
    Interview: 0,
    offerLetter: 0,
  });

  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");

  // Get current year for the chart
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (!localStorage.getItem("alertShown")) {
      toast.success("Login successfully");
      localStorage.setItem("alertShown", "true");
    }
    fetchCount();
    fetchChartData();
    // eslint-disable-next-line
  }, []);

  const fetchCount = async () => {
    try {
      const response = await axios.get(`${apiUrl}reports/getCountAdmin`, {
        headers: {
          Authorization: token,
          "Cache-Control": "no-cache",
        },
      });
      const data = response.data;
      setCount({
        Jobs: data.totalJobs || 0,
        Candidates: data.totalCandidates || 0,
        Interview: data.totalPendingCandidates || 0,
        offerLetter: data.totalCompletedCandidates || 0,
      });
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const fetchChartData = async () => {
    try {
      // Set date range for current year
      const fromDate = `${currentYear}-01-01`;
      const toDate = new Date().toISOString().split('T')[0]; // Current date

      const response = await axios.get(
        `${apiUrl}reports/getChartDataForAdminDashboard?fromDate=${fromDate}&toDate=${toDate}`,
        {
          headers: {
            Authorization: token,
            "Cache-Control": "no-cache",
          },
        }
      );

      const data = response.data;
      prepareChartData(data.jobsStats || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      toast.error("Failed to load chart data");
      setLoading(false);
    }
  };

  const prepareChartData = (jobsStats) => {
    if (!jobsStats || jobsStats.length === 0) {
      setChartData(null);
      return;
    }

    const labels = jobsStats.map(job => job.jobTitle);
    const totalCandidates = jobsStats.map(job => job.totalCandidates);
    const approved = jobsStats.map(job => job.approved);
    const rejected = jobsStats.map(job => job.rejected);
    const pending = jobsStats.map(job => job.pending);
    const scheduled = jobsStats.map(job => job.scheduled);
    const completed = jobsStats.map(job => job.completed);
    const cancelled = jobsStats.map(job => job.cancelled);
    const offered = jobsStats.map(job => job.offered);

    const data = {
      labels,
      datasets: [
        {
          label: 'Total Candidates',
          data: totalCandidates,
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          
        },
        {
          label: 'Approved',
          data: approved,
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Rejected',
          data: rejected,
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
        {
          label: 'Pending',
          data: pending,
          backgroundColor: 'rgba(255, 205, 86, 0.8)',
          borderColor: 'rgba(255, 205, 86, 1)',
          borderWidth: 1,
        },
        {
          label: 'Scheduled',
          data: scheduled,
          backgroundColor: 'rgba(153, 102, 255, 0.8)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        },
        {
          label: 'Completed',
          data: completed,
          backgroundColor: 'rgba(255, 159, 64, 0.8)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
        },
        {
          label: 'Cancelled',
          data: cancelled,
          backgroundColor: 'rgba(201, 203, 207, 0.8)',
          borderColor: 'rgba(201, 203, 207, 1)',
          borderWidth: 1,
        },
        {
          label: 'Offered',
          data: offered,
          backgroundColor: 'rgba(101, 183, 65, 0.8)',
          borderColor: 'rgba(101, 183, 65, 1)',
          borderWidth: 1,
        },
      ],
    };

    setChartData(data);
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Job Statistics Overview - ${currentYear}`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Job Positions'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Number of Candidates'
        },
        beginAtZero: true
      },
    },
  };

  const stats = [
    {
      count: count.Jobs,
      label: "Job Posting",
      icon: "fas fa-briefcase",
      bg: "bg-secondary",
      to: "/admin/jobpostlist",
    },
    {
      count: count.Candidates,
      label: "Candidate List",
      icon: "fas fa-user",
      bg: "bg-primary",
      to: "/admin/candidatelist",
    },
    {
      count: count.Interview,
      label: "Interview Schedule",
      icon: "fas fa-calendar-alt",
      bg: "bg-info",
      to: "/admin/schedulinglist",
    },
    {
      count: count.offerLetter,
      label: "offer Letter",
      icon: "fas fa-file-signature",
      bg: "bg-success",
      to: "/admin/offerletterlist",
    },
  ];

  return (
    <UserLayout ac1="active">
      <ContentHeader
        title="Dashboard"
        breadcrumbs={[{ label: "Admin Dashboard" }]}
      />
      <section className="content mb-4">
        <div className="row">
          {stats.map((item, i) => (
            <div key={i} className="col-lg-3 col-6">
              <Link to={item.to} className="text-dark">
                <div className={`small-box ${item.bg}`}>
                  <div className="inner">
                    <h3>
                      {" "}
                      <CountUp end={item.count} duration={2} />
                    </h3>
                    <p>{item.label}</p>
                  </div>
                  <div className="icon">
                    <i className={item.icon}></i>
                  </div>
                  <Link to={item.to} className="small-box-footer">
                    More info <i className="fas fa-arrow-circle-right"></i>
                  </Link>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Job Statistics Chart</h3>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="text-center">
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                    <p>Loading chart data...</p>
                  </div>
                ) : chartData ? (
                  <Bar data={chartData} options={chartOptions} />
                ) : (
                  <div className="text-center text-muted">
                    <p>No chart data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer style={{ width: "auto" }} />
    </UserLayout>
  );
}