import React, { useEffect, useState } from "react";
import { UserCheck, UserX } from "lucide-react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Layout from "../../components/Layout";
import ContentHeader from "../../components/ContentHeader";
import CountUp from "react-countup";
import axios from "axios";
import DataTable from "react-data-table-component";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [count, setCount] = useState({
    country: 0,
    states: 0,
    city: 0,
    users: 0,
    job: 0,
    resume: 0,
    company: 0,
  });
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const Env = process.env;

  useEffect(() => {
    if (!localStorage.getItem("alertShown")) {
      toast.success("Login successfully");
      localStorage.setItem("alertShown", "true");
    }
    fetchRecords();
    fetchCount();
    // eslint-disable-next-line
  }, []);

  const fetchCount = async () => {
    try {
      const response = await axios.get(`${apiUrl}reports/getCount`, {
        headers: {
          Authorization: token,
          "Cache-Control": "no-cache",
        },
      });
      const data = response.data;
      setCount({
        country: data.totalCountries || 0,
        states: data.totalStates || 0,
        city: data.totalCities || 0,
        users: data.totalUsers || 0,
        job: data.totalJobs || 0,
        company: data.totalCompanies || 0,
      });
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const links = [
    {
      to: "/admin/companys/list",
      text: "Manage Company",
      icon: <i className="fas fa-building"></i>,
      bg: "bg-secondary",
      count: `${count.company}`,
    },
    {
      to: "/admin/userlist",
      text: "Manage Users",
      icon: <i className="fas fa-users"></i>,
      bg: "bg-primary",
      count: `${count.users}`,
    },
    {
      to: "/admin/location",
      text: "Manage Locations",
      icon: <i className="fas fa-map-marker-alt"></i>,
      bg: "bg-info",
      count: `${count.city + count.states + count.country}`,
    },
    {
      to: "/admin/joblist",
      text: "Manage jobs",
      icon: <i className="fas fa-briefcase"></i>,
      bg: "bg-success",
      count: `${count.job}`,
    },
  ];

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiUrl}company/getLettestFiveCompanies`,
        {
          headers: {
            Authorization: `${token}`,
            "Cache-Control": "no-cache",
          },
        }
      );
      setLoading(false);
      const data = response.data?.data || [];
      setRecords(data);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message);
    }
  };
  

  const columns = [
    {
      name: "No",
      selector: (row, index) =>
        row.isSkeleton ? (
          <Skeleton width={60} />
        ) : (
          (currentPage - 1) * perPage + index + 1
        ),
      width: "40px",
      center: "true",
    },
    {
      name: "Logo",
      width: "150px",
      center: "true",
      cell: (row) =>
        row.isSkeleton ? (
          <Skeleton circle height={45} width={45} />
        ) : (
          <img
            src={row.logo || Env.REACT_APP_PROJECT_ICON}
            alt="Profile"
            height={40}
            width={"auto"}
            className="p-1"
          />
        ),
    },
    {
      name: "Name",

      cell: (row) =>
        row.isSkeleton ? <Skeleton width={120} /> : `${row.name}`,
    },
    {
      name: "Type",
      width: "80px",
      center: "true",
      cell: (row) => (row.isSkeleton ? <Skeleton width={60} /> : row.type),
    },
    {
      name: "Actions",
      width: "70px",
      center: "true",
      cell: (row) =>
        row.isSkeleton ? (
          <Skeleton width={50} height={30} />
        ) : (
          <div className="d-flex">
            <button
              type="button"
              className={`btn btn-xs mr-1 d-flex align-items-center justify-content-center rounded-circle ${
                row.isActive ? "btn-success" : "btn-secondary"
              }`}
              onClick={() => handleToggleStatus(row._id, row.isActive)}
              disabled={statusLoading[row._id]}
              style={{ width: "32px", height: "32px" }}
              title={row.isActive ? "Deactivate" : "Activate"}
            >
              {statusLoading[row._id] ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>
              ) : row.isActive ? (
                <UserCheck size={16} />
              ) : (
                <UserX size={16} />
              )}
            </button>
          </div>
        ),
    },
  ];

  const skeletonData = Array(10)
    .fill({})
    .map((_, index) => ({
      _id: index,
      isSkeleton: true,
    }));

  const handleToggleStatus = async (id) => {
    setStatusLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await axios.put(
        `${apiUrl}company/activate/${id}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      toast.success(response.data.data.message);
      fetchRecords((prev) => ({ ...prev, [id]: false }));
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setStatusLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <Layout ac1="active">
      <ContentHeader
        title="Dashboard"
        breadcrumbs={[{ label: "Admin Dashboard" }]}
      />
      <section className="content mb-1">
        <div className="container-fluid">
          <div className="row">
            {links.map(({ to, text, icon, bg, count }, idx) => (
              <div key={idx} className="col-lg-3 col-6">
                <Link to={to} className="text-dark">
                  <div className={`small-box ${bg}`}>
                    <div className="inner">
                      <h3>
                        <CountUp end={count} />
                      </h3>
                      <p>{text}</p>
                    </div>
                    <div className="icon">{icon}</div>
                    <span className="small-box-footer">
                      More info <i className="fas fa-arrow-circle-right"></i>
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-md-12">
              <div className="card card-primary card-outline">
                <div className="card-header">
                  <div className="d-flex justify-content-center font-weight-bold align-items-center">
                    <i className="fas fa-building"></i> &nbsp; Companies{" "}
                  </div>
                </div>
                <div className="card-body text-center p-2">
                  {loading ? (
                    <DataTable
                      columns={columns}
                      data={skeletonData}
                      className="custom-table"
                      noHeader
                      highlightOnHover
                      striped
                      customStyles={{
                        headCells: { style: { justifyContent: "center" } },
                      }}
                    />
                  ) : (
                    <DataTable
                      columns={columns}
                      data={records}
                      onChangePage={(page) => setCurrentPage(page)}
                      onChangeRowsPerPage={(newPerPage) =>
                        setPerPage(newPerPage)
                      }
                      className="custom-table"
                      noDataComponent="No data available"
                      highlightOnHover
                      striped
                      customStyles={{
                        headCells: { style: { justifyContent: "center" } },
                      }}
                      pointerOnHover
                      responsive
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer style={{width: 'auto'}} />
    </Layout>
  );
}
