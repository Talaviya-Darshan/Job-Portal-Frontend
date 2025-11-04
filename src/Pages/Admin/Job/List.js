import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FilePenLine, Trash2, X, Clock, MapPin, DollarSign, Calendar, Award, Shield, Star, Crown, Gem, Briefcase, Users, Clock3, Bell, FileText, Gift } from "lucide-react";
import Layout from "../../../components/Layout";
import ContentHeader from "../../../components/ContentHeader";
import DataTable from "react-data-table-component";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

export default function AddCompanys() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const Env = process.env;
  const [searchQuery, setSearchQuery] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}job/get`, {
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
    setDeleteLoading((prev) => ({ ...prev, [id]: true }));
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${apiUrl}job/delete/${id}`, {
            headers: {
              Authorization: `${token}`,
            },
          });

          fetchRecords();
          Swal.fire("Deleted!", "Job has been deleted.", "success");
          setDeleteLoading((prev) => ({ ...prev, [id]: false }));
        } catch (error) {
          setDeleteLoading((prev) => ({ ...prev, [id]: false }));
          Swal.fire("Error", error.response?.data?.message, "error");
        }
      }
    });
  };

  // Handle row click to open modal
  const handleRowClick = (row) => {
    if (!row.isSkeleton) {
      setSelectedJob(row);
      setModalOpen(true);
    }
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedJob(null);
  };

  // package config
  const packageConfig = {
    Admin: {
      color: "text-primary",
      bgColor: "bg-primary",
      icon: <Shield size={18} />,
    },
    Silver: {
      color: "text-secondary",
      bgColor: "bg-secondary",
      icon: <Star size={18} />,
    },
    Gold: {
      color: "text-warning",
      bgColor: "bg-warning",
      icon: <Crown size={18} />,
    },
    Platinum: {
      color: "text-info",
      bgColor: "bg-info",
      icon: <Gem size={18} />,
    },
  };

  // Format benefits array
  const formatBenefits = (benefits) => {
    if (Array.isArray(benefits)) {
      return benefits;
    }
    if (typeof benefits === 'string') {
      return benefits.split(',').map(benefit => benefit.trim());
    }
    return [];
  };

  const columns = [
    {
      name: "No",
      selector: (row, index) =>
        row.isSkeleton ? <Skeleton width={20} /> : index + 1,
      width: "60px",
      center: "true",
    },
    {
      name: "Company",
      width: "200px",
      selector: (row) => row?.company?.name || Env.REACT_APP_PROJECT_NAME,
      sortable: true,
      cell: (row) =>
        row.isSkeleton ? (
          <Skeleton circle height={45} width={45} />
        ) : (
          <div className="d-flex align-items-center">
            <img
              src={row?.company?.logo || Env.REACT_APP_PROJECT_ICON}
              alt="company logo"
              height={25}
              width={25}
              className="mr-1"
            />
            <span className="d-block">
              {row?.company?.name || Env.REACT_APP_PROJECT_NAME}
            </span>
          </div>
        ),
    },
    {
      name: "Job Title",
      selector: (row) => row.title,
      sortable: true,
      cell: (row) =>
        row.isSkeleton ? (
          <Skeleton width={180} />
        ) : (
          <div className="d-flex align-items-center gap-2">
            <span
              className={`d-flex align-items-center mr-1 fw-semibold ${
                packageConfig[row.package]?.color || "text-dark"
              }`}
            >
              {packageConfig[row.package]?.icon}
            </span>
            <span className="fw-semibold text-dark">{row.title}</span>
          </div>
        ),
    },
    {
      name: "Experience",
      selector: (row) => row.experience,
      sortable: true,
      width: "120px",
      cell: (row) =>
        row.isSkeleton ? <Skeleton width={120} /> : `${row.experience}`,
    },
    {
      name: "Salary",
      selector: (row) => row.salary,
      sortable: true,
      width: "100px",
      cell: (row) =>
        row.isSkeleton ? <Skeleton width={80} /> : `₹ ${row.salary} /-`,
    },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
      cell: (row) => (row.isSkeleton ? <Skeleton width={100} /> : row.type),
      width: "80px",
    },
    {
      name: "Location",
      selector: (row) => `${row.country}, ${row.state}, ${row.city}`,
      sortable: true,
      cell: (row) =>
        row.isSkeleton ? (
          <Skeleton width={100} />
        ) : (
          `${row.country}, ${row.state}, ${row.city}`
        ),
    },
    {
      name: "Actions",
      width: "60px",
      center: "true",
      cell: (row) =>
        row.isSkeleton ? (
          <Skeleton width={60} height={30} />
        ) : (
          <div className="d-flex">
            <button
              type="button"
              className="btn btn-danger btn-xs d-flex align-items-center justify-content-center rounded-circle"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row._id);
              }}
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

  // Skeleton rows
  const skeletonData = Array(8)
    .fill({})
    .map((_, index) => ({
      _id: index,
      isSkeleton: true,
    }));

  return (
    <Layout ac5="active">
      <ContentHeader
        title="Manage Jobs"
        breadcrumbs={[
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Manage Jobs" },
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
                        placeholder="Search jobs..."
                        title="Search within table"
                      />
                    </div>
                    <div className="bd-highlight">
                      {/* Add button if needed */}
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
                        rows: {
                          style: {
                            cursor: "pointer",
                          },
                        },
                      }}
                      pointerOnHover
                      responsive
                      onRowClicked={handleRowClick}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Details Modal */}
      {modalOpen && selectedJob && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={closeModal}
        >
          <div 
            className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header bg-gradient-primary text-white">
                <div className="d-flex align-items-center w-100">
                  <img
                    src={selectedJob?.company?.logo || Env.REACT_APP_PROJECT_ICON}
                    alt="company logo"
                    height={40}
                    width={40}
                    className="rounded me-3"
                  />
                  <div className="flex-grow-1">
                    <h4 className="modal-title mb-0 fw-bold">{selectedJob.title}</h4>
                    <div className="d-flex align-items-center flex-wrap mt-1">
                      <span className="badge bg-light text-dark me-2 mb-1">
                        {selectedJob?.company?.name || Env.REACT_APP_PROJECT_NAME}
                      </span>
                      <span className={`badge ${packageConfig[selectedJob.package]?.bgColor || 'bg-dark'} text-white me-2 mb-1 d-flex align-items-center`}>
                        {packageConfig[selectedJob.package]?.icon}
                        <span className="ms-1">{selectedJob.package}</span>
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={closeModal}
                  ></button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="modal-body p-4">
                <div className="row">
                  {/* Left Column - Basic Information */}
                  <div className="col-lg-8">
                    {/* Job Description */}
                    <div className="card mb-4">
                      <div className="card-header bg-light">
                        <h6 className="mb-0 d-flex align-items-center">
                          <FileText size={18} className="me-2" />
                          Job Description
                        </h6>
                      </div>
                      <div className="card-body">
                        <p className="mb-0">{selectedJob.description || "No description provided."}</p>
                      </div>
                    </div>

                    {/* Requirements & Skills */}
                    <div className="row">
                      {selectedJob.requirements && (
                        <div className="col-md-6">
                          <div className="card mb-4">
                            <div className="card-header bg-light">
                              <h6 className="mb-0 d-flex align-items-center">
                                <Award size={18} className="me-2" />
                                Requirements
                              </h6>
                            </div>
                            <div className="card-body">
                              <p className="mb-0">{selectedJob.requirements}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {selectedJob.skills && (
                        <div className="col-md-6">
                          <div className="card mb-4">
                            <div className="card-header bg-light">
                              <h6 className="mb-0 d-flex align-items-center">
                                <Users size={18} className="me-2" />
                                Skills Required
                              </h6>
                            </div>
                            <div className="card-body">
                              <p className="mb-0">{selectedJob.skills}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bond Information */}
                    {selectedJob.bondDescription && (
                      <div className="card mb-4 border-warning">
                        <div className="card-header bg-warning text-dark">
                          <h6 className="mb-0 d-flex align-items-center">
                            <Shield size={18} className="me-2" />
                            Bond Information
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            {selectedJob.bondTime && (
                              <div className="col-md-6">
                                <strong>Bond Duration:</strong>
                                <p className="mb-2">{selectedJob.bondTime}</p>
                              </div>
                            )}
                            <div className="col-12">
                              <strong>Bond Details:</strong>
                              <p className="mb-0 text-muted">{selectedJob.bondDescription}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Job Details */}
                  <div className="col-lg-4">
                    <div className="card sticky-top" style={{ top: '20px' }}>
                      <div className="card-header bg-light">
                        <h6 className="mb-0">Job Details</h6>
                      </div>
                      <div className="card-body">
                        {/* Salary */}
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
                            <DollarSign size={20} className="text-primary" />
                          </div>
                          <div>
                            <small className="text-muted">Salary</small>
                            <h6 className="mb-0 text-success">₹ {selectedJob.salary?.toLocaleString()} /-</h6>
                          </div>
                        </div>

                        {/* Experience */}
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-info bg-opacity-10 p-2 rounded me-3">
                            <Briefcase size={20} className="text-info" />
                          </div>
                          <div>
                            <small className="text-muted">Experience</small>
                            <h6 className="mb-0">{selectedJob.experience}</h6>
                          </div>
                        </div>

                        {/* Job Type */}
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-success bg-opacity-10 p-2 rounded me-3">
                            <Clock size={20} className="text-success" />
                          </div>
                          <div>
                            <small className="text-muted">Job Type</small>
                            <h6 className="mb-0">{selectedJob.type}</h6>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-warning bg-opacity-10 p-2 rounded me-3">
                            <MapPin size={20} className="text-warning" />
                          </div>
                          <div>
                            <small className="text-muted">Location</small>
                            <h6 className="mb-0">{selectedJob.city}, {selectedJob.state}, {selectedJob.country}</h6>
                          </div>
                        </div>

                        {/* Working Hours */}
                        {selectedJob.workingHours && (
                          <div className="d-flex align-items-center mb-3">
                            <div className="bg-secondary bg-opacity-10 p-2 rounded me-3">
                              <Clock3 size={20} className="text-secondary" />
                            </div>
                            <div>
                              <small className="text-muted">Working Hours</small>
                              <h6 className="mb-0">{selectedJob.workingHours}</h6>
                            </div>
                          </div>
                        )}

                        {/* Shift */}
                        {selectedJob.shift && (
                          <div className="d-flex align-items-center mb-3">
                            <div className="bg-dark bg-opacity-10 p-2 rounded me-3">
                              <Calendar size={20} className="text-dark" />
                            </div>
                            <div>
                              <small className="text-muted">Shift</small>
                              <h6 className="mb-0">{selectedJob.shift}</h6>
                            </div>
                          </div>
                        )}

                        {/* Notice Period */}
                        {selectedJob.noticePeriod && (
                          <div className="d-flex align-items-center mb-3">
                            <div className="bg-danger bg-opacity-10 p-2 rounded me-3">
                              <Bell size={20} className="text-danger" />
                            </div>
                            <div>
                              <small className="text-muted">Notice Period</small>
                              <h6 className="mb-0">{selectedJob.noticePeriod}</h6>
                            </div>
                          </div>
                        )}

                        {/* Flexible Working */}
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-success bg-opacity-10 p-2 rounded me-3">
                            <Clock3 size={20} className="text-success" />
                          </div>
                          <div>
                            <small className="text-muted">Flexible Working</small>
                            <h6 className="mb-0">{selectedJob.flexibleWorkingHours ? 'Yes' : 'No'}</h6>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Benefits Card */}
                    {selectedJob.benefits && (
                      <div className="card mt-4">
                        <div className="card-header bg-light">
                          <h6 className="mb-0 d-flex align-items-center">
                            <Gift size={18} className="me-2" />
                            Employee Benefits
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            {formatBenefits(selectedJob.benefits).map((benefit, index) => (
                              <div key={index} className="col-12 mb-2">
                                <div className="d-flex align-items-center">
                                  <div className="bg-success bg-opacity-10 rounded-circle p-1 me-2">
                                    <Gift size={12} className="text-success" />
                                  </div>
                                  <span className="small">{benefit}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <div className="d-flex justify-content-between w-100">
                  <div>
                    <small className="text-muted">
                      Posted on: {new Date(selectedJob.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </small>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => {
                        closeModal();
                        handleDelete(selectedJob._id);
                      }}
                    >
                      <Trash2 size={16} className="me-1" />
                      Delete Job
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer style={{ width: "auto" }} />
    </Layout>
  );
}