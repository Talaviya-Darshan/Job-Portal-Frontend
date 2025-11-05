import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FilePenLine, Trash2, UserCheck, UserX } from "lucide-react";
import Layout from "../../../components/Layout";
import DataTable from "react-data-table-component";
import axios from "axios";
import ContentHeader from "../../../components/ContentHeader";
import Skeleton from "react-loading-skeleton";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";

export default function List() {
  const [searchQuery, setSearchQuery] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState({});
  const [deleteLoading, setDeleteLoading] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const Env = process.env;

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}user/get`, {
        headers: {
          Authorization: `${token}`,
          "Cache-Control": "no-cache",
        },
      });
      setLoading(false);
      const data = response.data || [];
      setRecords(data);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeleteLoading((prev) => ({ ...prev, [id]: true }));
        try {
          await axios.delete(`${apiUrl}user/delete/${id}`, {
            headers: { Authorization: `${token}` },
          });
          setRecords((prevRecords) =>
            prevRecords.filter((record) => record._id !== id)
          );
          Swal.fire("Deleted!", "User has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error!", error.response?.data?.message, "error");
        } finally {
          setDeleteLoading((prev) => ({ ...prev, [id]: false }));
        }
      }
    });
  };

  const handleToggleStatus = async (id, currentStatus) => {
    setStatusLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await axios.put(
        `${apiUrl}user/active/${id}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      toast.success(response.data.message);
      setRecords((prevRecords) =>
        prevRecords.map((record) =>
          record._id === id ? { ...record, isActive: !currentStatus } : record
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setStatusLoading((prev) => ({ ...prev, [id]: false }));
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
      width: "60px",
      center: "true",
    },
    {
      name: "Profile",
      width: "100px",
      center: "true",
      cell: (row) =>
        row.isSkeleton ? (
          <Skeleton circle height={45} width={45} />
        ) : (
          <img
            src={row.profileImage || Env.REACT_APP_PROJECT_ICON}
            alt="Profile"
            height={45}
            width={45}
            className="p-1"
          />
        ),
    },
    {
      name: "First Name",
      sortable: true,
      cell: (row) =>
        row.isSkeleton ? <Skeleton width={120} /> : `${row.firstName}`,
    },
    {
      name: "Last Name",
      sortable: true,
      cell: (row) =>
        row.isSkeleton ? <Skeleton width={120} /> : `${row.lastName}`,
    },
    {
      name: "Username",
      sortable: true,
      cell: (row) => (row.isSkeleton ? <Skeleton width={80} /> : row.username),
    },
    {
      name: "Institute",
      sortable: true,
      cell: (row) =>
        row.isSkeleton ? <Skeleton width={100} /> : row.instituteName,
    },

    {
      name: "Actions",
      width: "130px",
      center: "true",
      cell: (row) =>
        row.isSkeleton ? (
          <Skeleton width={60} height={30} />
        ) : (
          <div className="d-flex">
            <button
              type="button"
              className={`btn btn-xs mr-1 d-flex align-items-center justify-content-center rounded-circle ${
                row.isActive ? "btn-success" : "btn-secondary"
              }`}
              onClick={() => handleToggleStatus(row._id, row.isActive)}
              disabled={statusLoading[row._id] || deleteLoading[row._id]}
              style={{ width: "32px", height: "32px" }}
              title={row.isActive ? "Deactivate" : "Activate"}
            >
              {statusLoading[row._id] ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden"></span>
                </div>
              ) : row.isActive ? (
                <UserCheck size={16} />
              ) : (
                <UserX size={16} />
              )}
            </button>
            <button
              type="button"
              className="btn btn-primary btn-xs d-flex align-items-center justify-content-center rounded-circle mr-1"
              style={{ width: "32px", height: "32px" }}
              onClick={() =>
                navigate(`/admin/useredit?id=${row._id}`, {
                  state: { id: row._id },
                })
              }
              disabled={statusLoading[row._id] || deleteLoading[row._id]}
            >
              <FilePenLine size={16} />
            </button>
            <button
              type="button"
              className="btn btn-danger btn-xs d-flex align-items-center justify-content-center rounded-circle"
              onClick={() => handleDelete(row._id)}
              disabled={statusLoading[row._id] || deleteLoading[row._id]}
              style={{ width: "32px", height: "32px" }}
            >
              {deleteLoading[row._id] ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden"></span>
                </div>
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          </div>
        ),
    },
  ];

  const filteredRecords = records.filter(
    (record) =>
      `${record.firstName} ${record.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      record.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (record.instituteName || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const skeletonData = Array(5)
    .fill({})
    .map((_, index) => ({
      _id: index,
      isSkeleton: true,
    }));

  return (
    <Layout ac3="active">
      <ContentHeader
        title="Manage User"
        breadcrumbs={[
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Manage User" },
        ]}
      />
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card card-primary card-outline">
                <div className="card-header">
                  <div className="d-flex justify-content-between">
                    <div className="bd-highlight">
                      <input
                        className="form-control"
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search"
                        title="Search within table"
                      />
                    </div>
                    <div className="bd-highlight">
                      <button
                        onClick={() => navigate("/admin/useradd")}
                        type="button"
                        className="btn btn-block btn-primary"
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body text-center p-2">
                  {loading ? (
                    <DataTable
                      columns={columns}
                      data={skeletonData}
                      pagination={false}
                      className="custom-table"
                      noHeader
                      highlightOnHover
                      striped
                      customStyles={{
                        headCells: {
                          style: {
                            justifyContent: "center",
                          },
                        },
                      }}
                    />
                  ) : (
                    <DataTable
                      columns={columns}
                      data={filteredRecords}
                      pagination
                      paginationPerPage={perPage}
                      paginationRowsPerPageOptions={[10, 20, 30, 40]}
                      onChangePage={(page) => setCurrentPage(page)}
                      onChangeRowsPerPage={(newPerPage) =>
                        setPerPage(newPerPage)
                      }
                      paginationComponentOptions={{
                        rowsPerPageText: "Rows per page",
                        rangeSeparatorText: "of",
                        selectAllRowsItem: true,
                        selectAllRowsItemText: "All",
                      }}
                      className="custom-table"
                      noDataComponent="No data available"
                      highlightOnHover
                      striped
                      customStyles={{
                        headCells: {
                          style: {
                            justifyContent: "center",
                          },
                        },
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
      <ToastContainer  style={{ width: "auto" }} />
    </Layout>
  );
}
