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
import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";

export default function List() {
  const [searchQuery, setSearchQuery] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const Env = process.env;
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}company/get`, {
        headers: {
          Authorization: `${token}`,
          "Cache-Control": "no-cache",
        },
      });
      setLoading(false);
      const data = response.data?.data || [];
      setRecords(data);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this company?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${apiUrl}company/delete/${id}`, {
            headers: {
              Authorization: `${token}`,
            },
          });
          fetchRecords();
          Swal.fire("Deleted!", "Company has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error", error.response?.data?.message, "error");
        }
      }
    });
  };

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
      name: "Logo",
      sortable: true,
      center: "true",
      width: "120px",

      cell: (row) =>
        row.isSkeleton ? (
          <div className="flex d-flex items-center align-items-center gap-2">
            <Skeleton circle height={45} width={45} />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <img
              src={row.logo || Env.REACT_APP_PROJECT_ICON}
              alt="Profile"
              height={40}
              width={"auto"}
              className="p-1 rounded-full"
            />
          </div>
        ),
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (row.isSkeleton ? <Skeleton width={100} /> : row.name),
    },
    {
      name: "Contact ",
      width: "100px",
      sortable: true,
      cell: (row) => (row.isSkeleton ? <Skeleton width={100} /> : row.phone),
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      cell: (row) => (row.isSkeleton ? <Skeleton width={100} /> : row.email),
    },
    {
      name: "GST Number",
      width: "100px",
      cell: (row) =>
        row.isSkeleton ? <Skeleton width={100} /> : row.GSTNumber,
    },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
      width: "60px",
      center: "true",
      cell: (row) => (row.isSkeleton ? <Skeleton width={60} /> : row.type),
    },

    {
      name: "Actions",
      width: "150px",
      center: "true",
      cell: (row) =>
        row.isSkeleton ? (
          <Skeleton width={120} height={30} />
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
              className="btn btn-primary btn-xs mr-1 d-flex align-items-center justify-content-center rounded-circle"
              onClick={() => navigate(`/admin/companys/edit?id=${row._id}`)}
              style={{ width: "32px", height: "32px" }}
              title="Edit"
            >
              <FilePenLine size={16} />
            </button>

            <button
              type="button"
              className="btn btn-danger btn-xs d-flex align-items-center justify-content-center rounded-circle"
              onClick={() => handleDelete(row._id)}
              style={{ width: "32px", height: "32px" }}
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
    },
  ];

  // Skeleton rows
  const skeletonData = Array(10)
    .fill({})
    .map((_, index) => ({
      _id: index,
      isSkeleton: true,
    }));

  return (
    <Layout ac2="active">
      <ContentHeader
        title="Manage Company "
        breadcrumbs={[
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Manage Company " },
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
                        onClick={() => navigate("/admin/companys/add")}
                        type="button"
                        className="btn btn-block btn-primary"
                      >
                        <i className="fas fa-plus"></i> Add
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
                        headCells: { style: { justifyContent: "center" } },
                      }}
                    />
                  ) : (
                    <DataTable
                      columns={columns}
                      data={records.filter((r) =>
                        r.name
                          ?.toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      )}
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
      <ToastContainer style={{ width: "auto" }} />
    </Layout>
  );
}
