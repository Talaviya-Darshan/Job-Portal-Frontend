import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FilePenLine, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import axios from "axios";
import Swal from "sweetalert2";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";

export default function ListMember() {
  const [searchQuery, setSearchQuery] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
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
      const response = await axios.get(`${apiUrl}country/get`, {
        headers: {
          Authorization: `${token}`,
          "Cache-Control": "no-cache",
        },
      });
      setLoading(false);
      const data = response.data.data || [];
      setRecords(data);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this country?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${apiUrl}country/delete/${id}`, {
            headers: {
              Authorization: `${token}`,
            },
          });
          fetchRecords();
          Swal.fire("Deleted!", "Country has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error", error.response?.data?.message);
        }
      }
    });
  };

  const filteredRecords = useMemo(() => {
    if (!searchQuery) return records;

    return records.filter(
      (record) =>
        record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [records, searchQuery]);

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
      name: "Flag",
      cell: (row) =>
        row.isSkeleton ? (
          <Skeleton width={40} height={30} />
        ) : (
          <img
            src={row.flag || Env.REACT_APP_PROJECT_ICON}
            alt={`${row.name} flag`}
            style={{ width: "30px", height: "20px", objectFit: "cover" }}
          />
        ),
      width: "80px",
      center: "true",
    },
    {
      name: "Name",
      cell: (row) => (row.isSkeleton ? <Skeleton width={120} /> : row.name),
      sortable: true,
    },
    {
      name: "Code",
      cell: (row) => (row.isSkeleton ? <Skeleton width={80} /> : row.code),
      sortable: true,
      width: "150px",
    },

    {
      name: "Actions",
      width: "110px",
      center: "true",
      cell: (row) =>
        row.isSkeleton ? (
          <Skeleton width={80} height={30} />
        ) : (
          <div className="d-flex">
            <button
              type="button"
              className="btn btn-primary btn-xs d-flex align-items-center justify-content-center rounded-circle mr-1"
              style={{ width: "32px", height: "32px" }}
              onClick={() =>
                navigate("/admin/countryedit", { state: { id: row._id } })
              }
            >
              <FilePenLine size={16} />
            </button>
            <button
              type="button"
              className="btn btn-danger btn-xs d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: "32px", height: "32px" }}
              onClick={() => handleDelete(row._id)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
    },
  ];

  // Skeleton data for loading state
  const skeletonData = Array(5)
    .fill({})
    .map((item, index) => ({
      ...item,
      _id: `skeleton-${index}`,
      isSkeleton: true,
    }));

  return (
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
                      placeholder="Search by name or code"
                      title="Search within table"
                    />
                  </div>
                  <div className="bd-highlight"></div>
                  <div className="bd-highlight">
                    <button
                      onClick={() => navigate("/admin/countryadd")}
                      type="button"
                      className="btn btn-block btn-primary"
                    >
                      <i className="fas fa-plus"></i> Add
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body text-center p-2">
                <DataTable
                  columns={columns}
                  data={loading ? skeletonData : filteredRecords}
                  pagination
                  paginationPerPage={perPage}
                  paginationRowsPerPageOptions={[10, 20, 30, 40]}
                  onChangePage={(page) => setCurrentPage(page)}
                  onChangeRowsPerPage={(newPerPage) => setPerPage(newPerPage)}
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
                        fontWeight: "bold",
                        fontSize: "14px",
                      },
                    },
                  }}
                  pointerOnHover
                  responsive
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
