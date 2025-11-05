import React, { useEffect, useState, useMemo } from "react";
import UserLayout from "../../../components/UserLayout";
import ContentHeader from "../../../components/ContentHeader";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import DataTable from "react-data-table-component";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ReportDashboard() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobsList, setJobsList] = useState([]);
  const [allJobsData, setAllJobsData] = useState([]);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    jobTitle: "",
  });

  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchChartData();
    // eslint-disable-next-line
  }, []);

  // ✅ Fetch Chart Data
  const fetchChartData = async (customFilters = {}) => {
    try {
      setLoading(true);
      const fromDate = customFilters.fromDate || `${currentYear}-01-01`;
      const toDate =
        customFilters.toDate || new Date().toISOString().split("T")[0];

      const url = `${apiUrl}reports/getChartDataForAdminDashboard?fromDate=${fromDate}&toDate=${toDate}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: token,
          "Cache-Control": "no-cache",
        },
      });

      const data = response.data.jobsStats || [];
      setAllJobsData(data);
      const jobTitles = data.map((job) => job.jobTitle);
      setJobsList([...new Set(jobTitles)]);

      prepareChartData(data);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      toast.error("Failed to load chart data");
      setChartData(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Prepare Chart Data
  const prepareChartData = (jobsStats) => {
    if (!jobsStats || jobsStats.length === 0) {
      setChartData(null);
      return;
    }

    const labels = jobsStats.map((job) => job.jobTitle);
    const totalCandidates = jobsStats.map((job) => job.totalCandidates);
    const approved = jobsStats.map((job) => job.approved);
    const rejected = jobsStats.map((job) => job.rejected);
    const pending = jobsStats.map((job) => job.pending);
    const scheduled = jobsStats.map((job) => job.scheduled);
    const completed = jobsStats.map((job) => job.completed);
    const cancelled = jobsStats.map((job) => job.cancelled);
    const offered = jobsStats.map((job) => job.offered);

    setChartData({
      labels,
      datasets: [
        { label: "Total Candidates", data: totalCandidates, backgroundColor: "rgba(54, 162, 235, 0.85)" },
        { label: "Approved", data: approved, backgroundColor: "rgba(75, 192, 192, 0.85)" },
        { label: "Rejected", data: rejected, backgroundColor: "rgba(255, 99, 132, 0.85)" },
        { label: "Pending", data: pending, backgroundColor: "rgba(255, 205, 86, 0.85)" },
        { label: "Scheduled", data: scheduled, backgroundColor: "rgba(153, 102, 255, 0.85)" },
        { label: "Completed", data: completed, backgroundColor: "rgba(255, 159, 64, 0.85)" },
        { label: "Cancelled", data: cancelled, backgroundColor: "rgba(201, 203, 207, 0.85)" },
        { label: "Offered", data: offered, backgroundColor: "rgba(101, 183, 65, 0.85)" },
      ],
    });
  };

  // ✅ Chart Options
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            usePointStyle: true,
            pointStyle: "rectRounded",
            boxWidth: 10,
            boxHeight: 10,
            padding: 16,
            font: { size: 12, weight: "500" },
          },
        },
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
      scales: {
        x: { title: { display: true, text: "Job Positions" } },
        y: { beginAtZero: true, title: { display: true, text: "Number of Candidates" } },
      },
    }),
    [currentYear]
  );

  // ✅ Filter Handlers
  const handleFilterApply = async () => {
    const { fromDate, toDate, jobTitle } = filters;

    if (fromDate && toDate) {
      await fetchChartData(filters);
      if (jobTitle) {
        const filtered = allJobsData.filter((job) => job.jobTitle === jobTitle);
        prepareChartData(filtered);
      }
      return;
    }

    if (jobTitle) {
      const filtered = allJobsData.filter((job) => job.jobTitle === jobTitle);
      prepareChartData(filtered);
      return;
    }

    toast.warning("Please select date range or job to filter");
  };

  const handleClearFilter = () => {
    setFilters({ fromDate: "", toDate: "", jobTitle: "" });
    fetchChartData();
  };

  // ✅ Excel Export
  const handleExportExcel = async () => {
    if (allJobsData.length === 0) {
      toast.warning("No data to export");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Job Report");

    worksheet.columns = [
      { header: "Job Title", key: "jobTitle", width: 25 },
      { header: "Total Candidates", key: "totalCandidates", width: 20 },
      { header: "Approved", key: "approved", width: 15 },
      { header: "Rejected", key: "rejected", width: 15 },
      { header: "Pending", key: "pending", width: 15 },
      { header: "Scheduled", key: "scheduled", width: 15 },
      { header: "Completed", key: "completed", width: 15 },
      { header: "Cancelled", key: "cancelled", width: 15 },
      { header: "Offered", key: "offered", width: 15 },
    ];

    allJobsData.forEach((job) => worksheet.addRow(job));

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0074D9" },
    };

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Job_Report_${Date.now()}.xlsx`);
    toast.success("Excel file exported successfully!");
  };

  // ✅ DataTable Columns
  const columns = [
    {name:"No" ,selector: (row, index) => index + 1, width: "60px" , center: "true", },
    { name: "Job Title", selector: (row) => row.jobTitle,  wrap: true },
    { name: "Approved", selector: (row) => row.approved,width: "80px" , },
    { name: "Rejected", selector: (row) => row.rejected,width: "80px" ,  },
    { name: "Pending", selector: (row) => row.pending, width: "80px" , },
    { name: "Scheduled", selector: (row) => row.scheduled, width: "80px" ,  },
    { name: "Completed", selector: (row) => row.completed, width: "80px" , },
    { name: "Cancelled", selector: (row) => row.cancelled,  width: "80px" , },
    { name: "Offered", selector: (row) => row.offered,width: "80px" ,   },
    { name: "Total ", selector: (row) => row.totalCandidates, width: "100px" , },
  ];

  

  return (
    <UserLayout ac7="active">
      <ContentHeader
        title="Report"
        breadcrumbs={[
          { label: "Dashboard", to: "/admin/userdashboard" },
          { label: "Report" },
        ]}
      />

      {/* Filter Section */}
      <section className="content mb-4">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-3">
                <label className="form-label">From Date</label>
                <input
                  type="date"
                  className="form-control rounded-2"
                  value={filters.fromDate}
                  onChange={(e) =>
                    setFilters({ ...filters, fromDate: e.target.value })
                  }
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">To Date</label>
                <input
                  type="date"
                  className="form-control rounded-2"
                  value={filters.toDate}
                  onChange={(e) =>
                    setFilters({ ...filters, toDate: e.target.value })
                  }
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Job Title</label>
                <select
                  className="form-control rounded-2"
                  value={filters.jobTitle}
                  onChange={(e) =>
                    setFilters({ ...filters, jobTitle: e.target.value })
                  }
                >
                  <option value="">All Jobs</option>
                  {jobsList.map((title, index) => (
                    <option key={index} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3 d-flex gap-2 justify-content-end">
                <button
                  className="btn btn-primary px-3 mx-2 fw-semibold"
                  onClick={handleFilterApply}
                  disabled={loading}
                >
                  {loading ? "..." : "Filter"}
                </button>
                <button
                  className="btn btn-outline-secondary px-3 fw-semibold"
                  onClick={handleClearFilter}
                  disabled={loading}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="card-body" style={{ height: 400 }}>
            {loading ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 mb-0">Loading chart data...</p>
              </div>
            ) : chartData ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <div className="text-center text-muted">
                <p>No chart data available</p>
              </div>
            )}
          </div>

          {/* DataTable Section */}
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-semibold mb-0"> Job Statistics</h5>
              <button
                className="btn btn-success btn-sm fw-semibold"
                onClick={handleExportExcel}
              >
                Export to Excel
              </button>
            </div>

            <DataTable
              columns={columns}
              data={allJobsData}
              pagination
              highlightOnHover
              className="custom-table"
              striped
              dense
               customStyles={{
                        headCells: {
                          style: {
                            justifyContent: "center",
                          },
                        },
                      }}
             
              noDataComponent="No job data available"
            />
          </div>
        </div>
      </section>

      <ToastContainer style={{ width: "auto" }} />
    </UserLayout>
  );
}
